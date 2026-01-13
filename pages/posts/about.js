import Layout, { siteTitle } from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/about.module.css";
import "../../components/firebase";
import headerFont from "../../components/Font";
import Bookshelf from "../../components/Bookshelf";
import GifTV from "../../components/Television";
import SpotifyEmbed from "../../components/MusicPlayer";

const books = [
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1641271171i/58085267.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1448108591i/27071490.jpg",

  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1439218170i/4364.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1529845599i/34051011.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1683818219i/139400713.jpg",
  "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1577090827l/51791252.jpg",
];

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>About Me</h1>
        <div className={`${utilStyles.aboutText} ${styles.aboutContent}`}>
          <p>
            Below, I've compiled a list of my favorites - specifically books, TV
            shows, and music. I try to keep them updated when I can. Please
            contact me if you'd like to geek out over anything listed together!
          </p>
          <p>
            Currently, I am reading Project Hail Mary by Andy Weir and listening
            to a lot of Olviia Dean. My partner and I are also playing Call of
            the Sea on the Playstation 5.
          </p>
          <h1 className={headerFont.className}>Books</h1>
          <Bookshelf books={books} />

          <h1 className={headerFont.className}>TV Shows</h1>
          <GifTV />

          <h1 className={headerFont.className}>Albums</h1>
          <SpotifyEmbed />
        </div>
      </article>
    </Layout>
  );
}
