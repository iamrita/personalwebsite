// Bookshelf.js
import React from "react";
import styles from "../styles/bookshelf.module.css";



function Book({ imageURL }) {
  return (
    <div className={styles.book} style={{ "--bg-image": `url(${imageURL})` }} />
  );
}

function Bookshelf({ books }) {
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
