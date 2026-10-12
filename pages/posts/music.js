import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import headerFont from "../../components/Font";
import SpotifyEmbed from "../../components/MusicPlayer";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/music.module.css";
import {
  favoriteAlbums,
  spotifyAlbumUrl,
} from "../../lib/favoriteMusic";

export default function Music() {
  return (
    <Layout>
      <Head>
        <title>Favorite Music</title>
      </Head>
      <h1 className={headerFont.className}>Favorite Music</h1>
      <p className={styles.intro}>
        These are albums I keep coming back to — the ones I reach for on long
        walks, at the gym, or when I need something familiar. You can also find
        books and TV on my{" "}
        <Link href="/posts/about" className={utilStyles.link}>
          about page
        </Link>
        .
      </p>
      <ol className={styles.albumList}>
        {favoriteAlbums.map((album, index) => (
          <li key={album.spotifyId} className={styles.albumListItem}>
            <a
              href={spotifyAlbumUrl(album.spotifyId)}
              className={`${utilStyles.link} ${styles.albumLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {index + 1}. {album.title}
            </a>
            <span className={styles.albumMeta}>
              {album.artist} · {album.year}
            </span>
          </li>
        ))}
      </ol>
      <section className={styles.embedSection} aria-label="Spotify previews">
        <SpotifyEmbed />
      </section>
    </Layout>
  );
}
