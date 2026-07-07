import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../../components/firebase";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/recentMusic.module.css";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import headerFont from "../../components/Font";
import { formatDistanceToNow } from "date-fns";

export default function RecentMusic() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "recentTracks"),
      orderBy("playedAt", "desc"),
      limit(50)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            trackName: data.trackName,
            artistName: data.artistName,
            albumName: data.albumName,
            albumImageUrl: data.albumImageUrl,
            spotifyUrl: data.spotifyUrl,
            playedAt: data.playedAt?.toDate?.() ?? null,
          };
        });
        setTracks(items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Recent Music</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>Recent Music</h1>
        <p className={styles.intro}>
          Tracks I have listened to recently, synced from Spotify. For albums I
          keep coming back to, see my{" "}
          <Link href="/posts/about" className={utilStyles.link}>
            about page
          </Link>
          .
        </p>

        {loading ? (
          <p className={styles.emptyState}>Loading recent tracks…</p>
        ) : tracks.length === 0 ? (
          <p className={styles.emptyState}>
            No recent tracks yet. Listening history will appear here after
            Spotify is connected.
          </p>
        ) : (
          <ul className={styles.trackList}>
            {tracks.map((track) => (
              <li key={track.id} className={styles.trackItem}>
                {track.albumImageUrl ? (
                  <img
                    src={track.albumImageUrl}
                    alt=""
                    className={styles.albumArt}
                    width={56}
                    height={56}
                  />
                ) : (
                  <div className={styles.albumArt} aria-hidden="true" />
                )}
                <div className={styles.trackDetails}>
                  {track.spotifyUrl ? (
                    <p className={styles.trackName}>
                      <a
                        href={track.spotifyUrl}
                        className={utilStyles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {track.trackName}
                      </a>
                    </p>
                  ) : (
                    <p className={styles.trackName}>{track.trackName}</p>
                  )}
                  <p className={styles.trackMeta}>
                    {track.artistName}
                    {track.albumName ? ` · ${track.albumName}` : ""}
                  </p>
                </div>
                {track.playedAt && (
                  <time
                    className={styles.playedAt}
                    dateTime={track.playedAt.toISOString()}
                  >
                    {formatDistanceToNow(track.playedAt, { addSuffix: true })}
                  </time>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.paragraph}>
          <em>
            This page reads from a Firestore collection that a Firebase Cloud
            Function keeps in sync with Spotify&apos;s recently-played API,
            similar to how my{" "}
            <Link href="/posts/activities" className={utilStyles.link}>
              activity calendar
            </Link>{" "}
            pulls from Strava. Authorise Spotify once, then scheduled syncs
            refresh the list every 30 minutes.
          </em>
        </p>
      </article>
    </Layout>
  );
}
