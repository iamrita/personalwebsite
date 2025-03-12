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

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About</title>
      </Head>
      <MovieSticker />
      <BookSticker />
      <VideoGameSticker />
      <MusicSticker />
      <article>
        <h1 className={utilStyles.headingXl}>About Me</h1>
        <div className={utilStyles.aboutText}>
          <p>
            Below, I've compiled a list of my favorites - places, books, TV
            shows, music, and movies. I try to keep them updated when I can.
            Please contact me if you'd like to geek out over anything listed
            together!
          </p>
          <p>
            I also love to play{" "}
            <Link className={utilStyles.link} href={`/posts/connections`}>
              Connections
            </Link>
            . This is a part of my website that I'm working on that is a work in
            progress.
          </p>
          <h1 className={utilStyles.headingAbout}>Books</h1>
          <ul>
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
          </ul>

          <h1 className={utilStyles.headingAbout}>TV Shows</h1>
          <ul>
            <li>Severance (Apple TV)</li>
            <li>Atlanta (Hulu)</li>
            <li>Insecure (HBO Max)</li>
            <li>Chernobyl (HBO Max)</li>
          </ul>

          <h1 className={utilStyles.headingAbout}>Movies</h1>
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

          <h1 className={utilStyles.headingAbout}>Albums</h1>
          <ul>
            <li>Ctrl by SZA</li>
            <li>Nothing Like the Sun by Sting</li>
            <li>The Miseducation of Lauryn Hill by Lauryn Hill</li>
            <li>Swimming by Mac Miller</li>
            <li>ANTI by Rihanna</li>
            <li>Channel Orange by Frank Ocean</li>
            <li>Malibu by Anderson Paak</li>
          </ul>
        </div>
      </article>
    </Layout>
  );
}
