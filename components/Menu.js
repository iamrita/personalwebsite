import React, { useState } from "react";
import styles from "../styles/utils.module.css";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.menuContainer}>
      {/* {isOpen && (
        <div className={styles.menuContent}>
          <img
            src="/images/image1.jpg"
            alt="Image 1"
            className={styles.menuImage}
          />
          <img src="image2.jpg" alt="Image 2" className={styles.menuImage} />
          <img src="image3.jpg" alt="Image 3" className={styles.menuImage} />
        </div>
      )} */}

      {isOpen && (
        <div className={styles.speechBubble}>
          <p>I am currently reading Martyr! by Kaveh Akbar.</p>
        </div>
      )}
      <div className={styles.menuButton} onClick={toggleMenu}>
        📖
      </div>
    </div>
  );
};

export default Menu;
