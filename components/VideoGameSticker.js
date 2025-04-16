import React, { useState } from "react";
import styles from "../styles/utils.module.css";

const VideoGameSticker = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.videoGameContainer}>
      {isOpen && (
        <div className={styles.videoGameSpeechBubble}>
          <p>I am currently playing Split Fiction on the PlayStation V.</p>
        </div>
      )}
      <div
        className={styles.menuButton}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        🎮
      </div>
    </div>
  );
};

export default VideoGameSticker;
