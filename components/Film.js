import React from "react";
import styles from "../styles/film.module.css";

const Film = () => {
  return (
    <div>
      <div className={styles.film}>
        <div className={styles.strip}>
          <div className={styles.frame}>
            <div
              className={styles.frameContent}
              style={{
                backgroundImage: `url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDZ1ZHE5eWRmbDBpeHd6bjBydW1xYWt1ZmNxbHpncnJ3djVibnF2YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l46CAeMR1XVgrpY5O/giphy.gif)`,
              }}
            />
          </div>
          <div className={styles.frame}>
            <div
              className={styles.frameContent}
              style={{
                backgroundImage: `url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDZ1ZHE5eWRmbDBpeHd6bjBydW1xYWt1ZmNxbHpncnJ3djVibnF2YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l46CAeMR1XVgrpY5O/giphy.gif)`,
              }}
            />
          </div>
          <div className={styles.frame}>
            <div
              className={styles.frameContent}
              style={{
                backgroundImage: `url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDZ1ZHE5eWRmbDBpeHd6bjBydW1xYWt1ZmNxbHpncnJ3djVibnF2YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l46CAeMR1XVgrpY5O/giphy.gif)`,
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.can}>
        <div className={styles.topcap}></div>
        <div className={styles.text}>
          <p className={styles.gold}>GOLD</p>
          <p className={styles.num}>400</p>
          <p className={styles.mm}>35mm film for color prints</p>
        </div>
        <div className={styles.bottomcap}></div>
      </div>
    </div>
  );
};

export default Film;
