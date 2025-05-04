import Layout, { siteTitle } from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { useState, useEffect } from "react";
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

// Helper to generate calendar grid for current month
function generateCalendar(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalSlots = firstDayIndex + daysInMonth;
  const weeks = [];
  let current = 0;

  while (current < totalSlots) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dayIndex = current - firstDayIndex + 1;
      if (current < firstDayIndex || dayIndex > daysInMonth) {
        week.push(null);
      } else {
        week.push(dayIndex);
      }
      current++;
    }
    weeks.push(week);
  }
  return weeks;
}

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
            Below, I've compiled a list of my favorites - specifically books, TV
            shows, and music. I try to keep them updated when I can. Please
            contact me if you'd like to geek out over anything listed together!
          </p>
          <p>
            Currently, I am reading Careless People by Sarah Wynn-Wililams,
            listening to a lot of Harry Styles, and watching The Last of Us 2 on
            HBO Max. My partner and I are also playing Split Fiction on the
            Playstation 5.
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

          {/* <h1 className={headerFont.className}>Movies</h1>
          <ul>
            <li>The Devil Wears Prada</li>
            <li>The Farewell</li>
            <li>Marcel the Shell With Shoes On</li>
            <li>Spotlight</li>
            <li>Pride and Prejudice (Keira Knightley version)</li>
            <li>Zindagi Na Milegi Dobara</li>
            <li>A Real Pain</li>
            <li>Freaky Friday</li>
          </ul> */}

          <h1 className={headerFont.className}>Albums</h1>
          <SpotifyEmbed />
        </div>
      </article>
      <style jsx>
        {`
          p,
          ul {
            border: 1px solid black;
            font-size: 18px;
            border-radius: 8px;
            background-color: #e9f4e9;
            padding: 32px;
          }
        `}
      </style>
    </Layout>
  );
}
