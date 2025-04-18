import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/tv.module.css";

const CHANNELS = [
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDNpNzhqeHU5cnZoZXlsOGczN3R3dHpwMDZ0anY5aTdvd3k1c2hpdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XjDZoIXRpaJjZY6VFI/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXlkcWw3NzNrcWZwcWtjNmM5YmswcnV4Z3Mzeng0MGZ0N2JhMWZ3bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1BeVfW5f3VzAFnI1sw/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWlqMTZ4N3VxaW1lMnVvOGtjd3U5ZDJtbTFoZnU3NTU2bnF0MHRhMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wP2cdsCL3649JwDd2H/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG1maGlxY3M3NDVlMnN1cm4wbGlucnJmY2drMWpmNHpqdG02MHV3ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/C5eDFesCSregw/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpwbngyZzd6NXdvdHR5MGpvdDNxYWNkajYxanFoMnptd3JkN3phdSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/daCvsmaPOlffloSBeR/giphy.gif",
];

const STATIC_GIF =
  "https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571155222/giphy_n0r827.gif";

const GifTV = () => {
  const videoRef = useRef(null);
  const pixelsRef = useRef(null);
  const viewportRef = useRef(null);

  const [channelIndex, setChannelIndex] = useState(0);

  const [message, setMessage] = useState({ left: [], right: [] });

  const updateMessage = (side, text) => {
    setMessage((prev) => ({
      ...prev,
      [side]: [...prev[side], text],
    }));
    setTimeout(() => {
      setMessage((prev) => ({
        ...prev,
        [side]: prev[side].slice(1),
      }));
    }, 2000);
  };

  const changeChannel = (direction = "up") => {
    const newIndex =
      direction === "up"
        ? (channelIndex + 1) % CHANNELS.length
        : (channelIndex - 1 + CHANNELS.length) % CHANNELS.length;

    videoRef.current.src = STATIC_GIF;

    setTimeout(() => {
      setChannelIndex(newIndex);
      videoRef.current.src = CHANNELS[newIndex];
      updateMessage("left", `CH ${newIndex + 1}`);
    }, 333);
  };

  useEffect(() => {
    videoRef.current.src = CHANNELS[channelIndex];
  }, []);

  return (
    <section className={`${styles.row} ${styles.gutter}`}>
      <div className={styles.wrapper}>
        <div className={styles.gifTv}>
          <div ref={viewportRef} className={styles.viewport}>
            <img ref={videoRef} className={styles.video} alt="GIF TV" />
            <div
              ref={pixelsRef}
              className={styles.pixels}
              style={{
                backgroundImage: `url('https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571119227/vhs-overlay_zpzs7x.png')`,
              }}
            />
            <div className={styles.metaLeft}>
              {message.left.map((msg, i) => (
                <span
                  key={i}
                  className={`${styles.tvSpan} ${styles.activeText}`}
                >
                  {msg}
                </span>
              ))}
            </div>
            <div className={styles.metaRight}>
              {message.right.map((msg, i) => (
                <span
                  key={i}
                  className={`${styles.tvSpan} ${styles.activeText}`}
                >
                  {msg}
                </span>
              ))}
            </div>
          </div>

          <img
            className={styles.tv}
            src="https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571119227/80s-tv_ekkex2.png"
            alt="CRT TV"
          />
          <button className={styles.dial} onClick={() => changeChannel("up")} />
        </div>
      </div>
    </section>
  );
};

export default GifTV;
