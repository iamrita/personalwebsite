import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import "../components/firebase";
// import localFont from "next/font/local";
import headerFont from "../components/Font";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
}

// const yourFont = localFont({
//   src: "../fonts/test-domaine-text-bold.woff2", // path relative to this file
//   display: "swap",
//   variable: "--font-yourfont",
// });

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          {" "}
          Hi! My name is{" "}
          <Link href={`/posts/about`} className={utilStyles.link}>
            Amrita
          </Link>
          . I currently live in San Francisco, California and work as a senior
          software engineer for Maven Clinic, a virtual clinic for women and
          families. I recently have been volunteering at the San Francisco
          Tenants Union, where I help tenants learn about their rights against
          eviction and displacement.
          <br />
          <br />
          When I'm not working or volunteering, I'm usually doing yoga,
          top-roping, or trying to make it through a Barry's Bootcamp class
          without dying. Check out this little{" "}
          <Link href={`/posts/activities`} className={utilStyles.link}>
            activity calendar
          </Link>{" "}
          I made for myself!
        </p>
        <p>
          I also have a minor obsession with the{" "}
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
          You can find me on{" "}
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
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={headerFont.className}>Blog</h2>
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
      <style jsx>
        {`
          p {
            border: 1px solid black;
            font-size: 18px;
            border-radius: 8px;
            background-color: #f0f0f0;
            padding: 32px;
          }
        `}
      </style>
    </Layout>
  );
}
