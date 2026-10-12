import { XMLParser } from "fast-xml-parser";

export type Shelf = "currently-reading" | "read";

export interface ParsedBook {
  bookId: string;
  title: string;
  author: string;
  coverImageUrl: string;
  bookLink: string;
  dateAdded: string | null;
  dateRead: string | null;
  userRating: number | null;
  averageRating: number | null;
  numPages: number | null;
}

export interface StoredBook extends ParsedBook {
  shelf: Shelf;
  position: number;
}

const parser = new XMLParser({
  ignoreAttributes: true,
  trimValues: true,
  isArray: (tagName) => tagName === "item",
});

export function shelfFeedUrl(userId: string, shelf: Shelf): string {
  const base = `https://www.goodreads.com/review/list_rss/${encodeURIComponent(userId)}`;
  if (shelf === "read") {
    return `${base}?shelf=read&sort=date_read&order=d`;
  }
  return `${base}?shelf=currently-reading`;
}

export function parseGoodreadsRss(xml: string): ParsedBook[] {
  let parsed: unknown;
  try {
    parsed = parser.parse(xml);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Goodreads response was not valid XML: ${message}`);
  }

  const channel = asRecord(asRecord(parsed).rss).channel;
  if (!channel || typeof channel !== "object") {
    throw new Error("Goodreads response was not an RSS channel");
  }

  const items = asRecord(channel).item;
  if (items == null) return [];
  if (!Array.isArray(items)) {
    throw new Error("Goodreads RSS item list was not an array");
  }

  const books: ParsedBook[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const book = parseItem(item);
    if (!book || seen.has(book.bookId)) continue;
    seen.add(book.bookId);
    books.push(book);
  }
  return books;
}

/**
 * Currently-reading books are ordered by date added.
 * Finished books use user_read_at when Goodreads sent one. The read shelf
 * often leaves that tag empty, so those rows fall back to user_date_added.
 * A book still on the currently-reading shelf is not also listed as finished.
 */
export function selectShelfBooks(
  currentlyReading: ParsedBook[],
  finished: ParsedBook[],
  recentLimit: number
): StoredBook[] {
  const currentIds = new Set(currentlyReading.map((book) => book.bookId));
  const currentSorted = [...currentlyReading].sort(compareAdded);
  const recent = [...finished]
    .filter((book) => !currentIds.has(book.bookId))
    .sort(compareFinished)
    .slice(0, recentLimit);

  return [
    ...currentSorted.map((book, position) => ({
      ...book,
      shelf: "currently-reading" as const,
      position,
    })),
    ...recent.map((book, position) => ({
      ...book,
      shelf: "read" as const,
      position,
    })),
  ];
}

export function staleReadingDocIds(
  existingIds: string[],
  books: StoredBook[],
  statusDocId: string
): string[] {
  const keep = new Set(books.map((book) => book.bookId));
  keep.add(statusDocId);
  return existingIds.filter((id) => !keep.has(id));
}

function parseItem(item: unknown): ParsedBook | null {
  const record = asRecord(item);
  const bookId = asText(record.book_id);
  const title = asText(record.title);
  if (!bookId || !title) return null;

  const coverImageUrl =
    asText(record.book_large_image_url) ||
    asText(record.book_image_url) ||
    asText(record.book_medium_image_url) ||
    asText(record.book_small_image_url);

  return {
    bookId,
    title,
    author: asText(record.author_name),
    coverImageUrl,
    bookLink: `https://www.goodreads.com/book/show/${encodeURIComponent(bookId)}`,
    dateAdded: toIso(asText(record.user_date_added)),
    dateRead: toIso(asText(record.user_read_at)),
    userRating: positiveNumber(record.user_rating),
    averageRating: positiveNumber(record.average_rating),
    numPages: positiveNumber(asRecord(record.book).num_pages),
  };
}

function compareAdded(a: ParsedBook, b: ParsedBook): number {
  return recency(b.dateAdded) - recency(a.dateAdded) || a.title.localeCompare(b.title);
}

function compareFinished(a: ParsedBook, b: ParsedBook): number {
  // Newest finish first. dateRead is already null when the feed left it empty.
  return (
    recency(b.dateRead ?? b.dateAdded) - recency(a.dateRead ?? a.dateAdded) ||
    a.title.localeCompare(b.title)
  );
}

function recency(iso: string | null): number {
  if (!iso) return Number.NEGATIVE_INFINITY;
  const time = Date.parse(iso);
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

function toIso(raw: string): string | null {
  if (!raw) return null;
  const time = Date.parse(raw);
  if (Number.isNaN(time)) return null;
  return new Date(time).toISOString();
}

function positiveNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0) return null;
  return number;
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}
