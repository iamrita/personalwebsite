import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import headerFont from "./Font";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/reading.module.css";

const SHELVES = [
  {
    id: "currently-reading",
    title: "Currently reading",
    waiting: "The currently-reading shelf hasn't synced yet.",
    empty: "Nothing on the currently-reading shelf right now.",
  },
  {
    id: "read",
    title: "Just finished",
    waiting: "Finished books haven't synced yet.",
    empty: "No recently finished books yet.",
  },
];

function formatShelfDate(iso, timeZone) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(date);
}

function bookMeta(book) {
  // Goodreads writes user_read_at as midnight UTC, a calendar date. Added
  // timestamps carry a real offset, so show those in Pacific time.
  const when = book.dateRead
    ? formatShelfDate(book.dateRead, "UTC")
    : formatShelfDate(book.dateAdded, "America/Los_Angeles");
  const whenLabel = !when ? null : book.dateRead ? `Finished ${when}` : `Added ${when}`;
  const pages = book.numPages ? `${book.numPages} pages` : null;
  const rating = book.userRating ? `Rated ${book.userRating}` : null;
  return [whenLabel, pages, rating].filter(Boolean).join(" · ");
}

function BookRow({ book }) {
  const meta = bookMeta(book);
  return (
    <li className={styles.book}>
      {book.coverImageUrl ? (
        <img
          className={styles.cover}
          src={book.coverImageUrl}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <div>
        <a className={utilStyles.link} href={book.bookLink}>
          {book.title}
        </a>
        {book.author ? <p className={styles.author}>{book.author}</p> : null}
        {meta ? <p className={styles.meta}>{meta}</p> : null}
      </div>
    </li>
  );
}

function ShelfColumn({ shelf, books, synced }) {
  return (
    <div>
      <h3 className={`${headerFont.className} ${styles.shelfTitle}`}>
        {shelf.title}
      </h3>
      {books.length === 0 ? (
        <p className={styles.empty}>{synced ? shelf.empty : shelf.waiting}</p>
      ) : (
        <ul className={styles.list}>
          {books.map((book) => (
            <BookRow key={book.bookId} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReadingShelf() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reading"),
      (snap) => {
        const nextBooks = [];
        let nextStatus = null;
        snap.forEach((doc) => {
          const data = doc.data();
          if (data.kind === "status") {
            nextStatus = data;
            return;
          }
          if (
            data.shelf === "currently-reading" ||
            data.shelf === "read"
          ) {
            nextBooks.push(data);
          }
        });
        nextBooks.sort(
          (a, b) =>
            a.shelf.localeCompare(b.shelf) || (a.position ?? 0) - (b.position ?? 0)
        );
        setBooks(nextBooks);
        setStatus(nextStatus);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || "The bookshelf request failed.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <div className={styles.card}>
      {loading ? (
        <p className={styles.status}>Loading books…</p>
      ) : error ? (
        <p className={styles.error} role="alert">
          Couldn&apos;t load the bookshelf. {error}
        </p>
      ) : (
        <>
          {status && status.ok === false ? (
            <p className={styles.warning} role="alert">
              The last Goodreads sync failed, so this may be out of date.
              {status.error ? ` ${status.error}` : ""}
            </p>
          ) : null}
          <div className={styles.columns}>
            {SHELVES.map((shelf) => (
              <ShelfColumn
                key={shelf.id}
                shelf={shelf}
                synced={Boolean(status)}
                books={books.filter((book) => book.shelf === shelf.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
