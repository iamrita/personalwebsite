// Bookshelf.js
import React from "react";
import styles from "../styles/bookshelf.module.css";

const books = [
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1641271171i/58085267.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1448108591i/27071490.jpg",

  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1439218170i/4364.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1529845599i/34051011.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1683818219i/139400713.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1577090827l/51791252.jpg",
];

function Book({ imageURL }) {
  return (
    <div className={styles.book} style={{ "--bg-image": `url(${imageURL})` }} />
  );
}

function Bookshelf() {
  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.bookshelfWrapper}>
        <div className={styles.books}>
          {books.map((url, idx) => (
            <Book key={idx} imageURL={url} />
          ))}
        </div>
        <div className={styles.bookshelf} />
      </div>
    </div>
  );
}

export default Bookshelf;
