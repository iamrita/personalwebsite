import Layout, { siteTitle } from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import "../../components/firebase";
import MovieSticker from "../../components/MovieSticker";
import BookSticker from "../../components/BookSticker";
import VideoGameSticker from "../../components/VideoGameSticker";
import MusicSticker from "../../components/MusicSticker";
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
      {/* <MovieSticker />
      <BookSticker />
      <VideoGameSticker />
      <MusicSticker /> */}
      <article>
        <h1 className={headerFont.className}>About Me</h1>
        <div className={utilStyles.aboutText}>
          <p>
            Below, I've compiled a list of my favorites - places, books, TV
            shows, music, and movies. I try to keep them updated when I can.
            Please contact me if you'd like to geek out over anything listed
            together!
          </p>
          <p>
            Currently, I am reading Careless People by Sarah Wynn-Wililams,
            listening to a lot of Harry Styles, and watching The Last of Us 2 on
            HBO Max. My partner and I also just finished playing Indika on the
            Playstation V and are about to start Split Fiction.
          </p>
          <h1 className={headerFont.className}>Books</h1>
          <Bookshelf books={books} />
          {/* <Bookshelf /> */}

          {/* <ul>
            <li>The Storied Life of A.J. Fikry by Gabrielle Zevin</li>
            <li>Different by Franz de Waal</li>
            <li>Maximum City by Suketu Mehta</li>
            <li>Unaccustomed Earth by Jhumpa Lahiri</li>
            <li>Good Material by Dolly Alderton</li>
            <li>Homegoing by Yaa Gyasi</li>
            <li>The Vanishing Half by Brit Bennett</li>
            <li>Pachinko by Min Jin Lee</li>
            <li>The Interestings by Meg Wolitzer</li>
            <li>Martyr! By Kaveh Akbar</li>
          </ul> */}

          <h1 className={headerFont.className}>TV Shows</h1>
          <GifTV />

          <h1 className={headerFont.className}>Movies</h1>
          <ul>
            <li>The Devil Wears Prada</li>
            <li>The Farewell</li>
            <li>Marcel the Shell With Shoes On</li>
            <li>Spotlight</li>
            <li>Pride and Prejudice (Keira Knightley version)</li>
            <li>Zindagi Na Milegi Dobara</li>
            <li>A Real Pain</li>
            <li>Freaky Friday</li>
          </ul>

          <h1 className={headerFont.className}>Albums</h1>
          <SpotifyEmbed />
        </div>
      </article>
    </Layout>
  );
}
