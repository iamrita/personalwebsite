import React, { useState } from "react";
import styles from "../styles/utils.module.css";

const AppleSticker = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.menuContainer}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={styles.menuButton}>🍎</div>
      {isOpen && (
        <div className={styles.speechBubble}>
          <p>Hello Anirudh.</p>
        </div>
      )}
    </div>
  );
};

export default AppleSticker;
