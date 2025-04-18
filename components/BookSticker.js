import React, { useState } from "react";
import styles from "../styles/utils.module.css";

const BookSticker = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.menuContainer}>
      {isOpen && (
        <div className={styles.speechBubble}>
          <p>
            I am currently reading Between Two Kingdoms by Suleika Jaouad.
          </p>
        </div>
      )}
      <div
        className={styles.menuButton}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        📖
      </div>
    </div>
  );
};

export default BookSticker;
