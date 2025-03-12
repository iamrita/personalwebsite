import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import "../components/firebase";
import BookSticker from "../components/BookSticker";
import MovieSticker from "../components/MovieSticker";
import VideoGameSticker from "../components/VideoGameSticker";
import MusicSticker from "../components/MusicSticker";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <MovieSticker />
      <section className={utilStyles.headingMd}>
        <p>
          {" "}
          Hi! My name is{" "}
          <Link href={`/posts/about`} className={utilStyles.link}>
            Amrita
          </Link>
          . I currently live in San Francisco, California and work as an
          engineer for Maven Clinic, a virtual clinic for women and families. I
          recently have been volunteering at the San Francisco Tenants Union,
          where I help tenants learn about their rights against eviction and
          displacement. I also have a minor obsession with the{" "}
          <a
            href="https://www.nytimes.com/games/connections"
            className={utilStyles.link}
          >
            NY Times Connections
          </a>
          , so much so that I've made my own{" "}
          <Link href={`/posts/connections`} className={utilStyles.link}>
            here
          </Link>
          . I post a new board every day!
        </p>
        <p>
          When I'm not working or volunteering, I'm attempting to triangulate
          Rihanna's location on any given night. You can find me on{" "}
          <a href="https://twitter.com/iamrita98" className={utilStyles.link}>
            Twitter
          </a>{" "}
          or check out my{" "}
          <a
            href="/files/resume_feb_2024.pdf"
            download
            className={utilStyles.link}
          >
            resume
          </a>
          .
        </p>
        <p>
          Looking for a book recommendation? Check out my little recommender
          game{" "}
          <Link href={`/posts/recommend`} className={utilStyles.link}>
            here
          </Link>
          .
        </p>
        <BookSticker></BookSticker>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <div className={utilStyles.blogContainer}>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`} className={utilStyles.link}>
                  {title}
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
          </ul>
          <div className={utilStyles.gifContainer}>
            <img src="/images/girl.gif" alt="GIF" className={utilStyles.gif} />
          </div>
        </div>
      </section>
      <VideoGameSticker />
      <MusicSticker />
    </Layout>
  );
}
