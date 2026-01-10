import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import "../components/firebase";
import headerFont from "../components/Font";

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
      <section className={utilStyles.headingMd}>
        <p>
          {" "}
          Hi! My name is{" "}
          <Link href={`/posts/about`} className={utilStyles.link}>
            Amrita
          </Link>
          . I currently live in San Francisco, California and work as a Field Engineer at Cursor. I recently have been volunteering at the San Francisco
          Tenants Union, where I help tenants learn about their rights against
          eviction and displacement.
          <br />
          <br />
          When I'm not working or volunteering, I'm usually top-roping at the
          climbing gym,{" "}
          <Link href={`/posts/recommend`} className={utilStyles.link}>
            reading
          </Link>
          , or playing{" "}
          <Link href={`/posts/connections`} className={utilStyles.link}>
            puzzle games
          </Link>
          . Check out my{" "}
          <Link href={`/posts/activities`} className={utilStyles.link}>
            activity calendar
          </Link>{" "}
          I made for myself! You can find me on{" "}
          <a href="https://twitter.com/iamrita98" className={utilStyles.link}>
            Twitter
          </a>{" "}
          or check out my{" "}
          <a
            href="/files/resume_jul_2025.pdf"
            download
            className={utilStyles.link}
          >
            resume
          </a>
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
        </div>
      </section>
      <style jsx>
        {`
          p {
            border: 1px solid black;
            font-size: 18px;
            border-radius: 8px;
            background-color: #f1f5fd;
            padding: 32px;
          }
        `}
      </style>
    </Layout>
  );
}
