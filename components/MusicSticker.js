import React, { useState } from "react";
import styles from "../styles/utils.module.css";

const MusicSticker = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div
      className={styles.musicContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.menuButton}>🎧</div>
      {isOpen && (
        <div className={styles.musicSpeechBubble}>
          <p>I am currently listening to Harry Styles.</p>
        </div>
      )}
    </div>
  );
};

export default MusicSticker;
