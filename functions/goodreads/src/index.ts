import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import {
  READING_COLLECTION,
  RECENTLY_READ_LIMIT,
  STATUS_DOC_ID,
  SYNC_SCHEDULE,
  goodreadsUserId,
} from "./config.js";
import {
  parseGoodreadsRss,
  selectShelfBooks,
  shelfFeedUrl,
  staleReadingDocIds,
  type StoredBook,
} from "./rss.js";

initializeApp();
const db = getFirestore();

// Goodreads rejects browser CORS, so the site cannot read the shelf itself.
// A browser-like user agent: the site has answered 403s to bare clients before.
const USER_AGENT =
  "Mozilla/5.0 (compatible; amritav-goodreads-sync/1.0; +https://amritav.com)";

export const syncGoodreadsShelves = onSchedule(
  {
    schedule: SYNC_SCHEDULE,
    timeZone: "America/Los_Angeles",
    region: "us-central1",
    timeoutSeconds: 120,
    memory: "256MiB",
    maxInstances: 1,
  },
  async () => {
    const userId = goodreadsUserId.value().trim();
    if (!/^\d+$/.test(userId)) {
      throw new Error("GOODREADS_USER_ID must be a numeric Goodreads user id");
    }

    try {
      const [currentlyReadingXml, readXml] = await Promise.all([
        fetchShelf("currently-reading", userId),
        fetchShelf("read", userId),
      ]);
      const books = selectShelfBooks(
        parseGoodreadsRss(currentlyReadingXml),
        parseGoodreadsRss(readXml),
        RECENTLY_READ_LIMIT
      );
      await replaceReadingCollection(books);
      logger.info("Synced Goodreads shelves", {
        currentlyReading: books.filter((book) => book.shelf === "currently-reading")
          .length,
        recentlyRead: books.filter((book) => book.shelf === "read").length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error("Goodreads sync failed", error);
      try {
        await db
          .collection(READING_COLLECTION)
          .doc(STATUS_DOC_ID)
          .set(
            {
              kind: "status",
              ok: false,
              error: message.slice(0, 500),
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      } catch (writeError) {
        logger.error("Failed to record Goodreads sync error", writeError);
      }
      throw error;
    }
  }
);

async function fetchShelf(
  shelf: "currently-reading" | "read",
  userId: string
): Promise<string> {
  const url = shelfFeedUrl(userId, shelf);
  const response = await fetch(url, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": USER_AGENT,
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`Goodreads ${shelf} feed returned ${response.status}`);
  }
  return response.text();
}

async function replaceReadingCollection(books: StoredBook[]): Promise<void> {
  const col = db.collection(READING_COLLECTION);
  const existing = await col.get();
  const batch = db.batch();
  const updatedAt = FieldValue.serverTimestamp();

  for (const id of staleReadingDocIds(
    existing.docs.map((doc) => doc.id),
    books,
    STATUS_DOC_ID
  )) {
    batch.delete(col.doc(id));
  }

  for (const book of books) {
    batch.set(col.doc(book.bookId), { ...book, updatedAt });
  }

  batch.set(col.doc(STATUS_DOC_ID), {
    kind: "status",
    ok: true,
    error: null,
    currentlyReadingCount: books.filter(
      (book) => book.shelf === "currently-reading"
    ).length,
    recentlyReadCount: books.filter((book) => book.shelf === "read").length,
    updatedAt,
  });

  await batch.commit();
}
