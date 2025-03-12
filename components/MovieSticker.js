import React, { useState } from "react";
import styles from "../styles/utils.module.css";

const MovieSticker = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.movieContainer}>
      <div
        className={styles.menuButton}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        🎬
      </div>
      {isOpen && (
        <div className={styles.speechBubble}>
          <p>
            I am currently watching Running Point on Netflix and Severance on
            Apple TV.
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieSticker;
