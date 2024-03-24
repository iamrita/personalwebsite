import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import "../components/firebase"
 

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
          Hi! My name is <Link href={`/posts/about`}>Amrita</Link>.
          I currently live in San Francisco, California and work as an engineer for Maven Clinic, a virtual clinic for women and families. I recently have been
          volunteering at the San Francisco Tenants Union, where I help tenants
          learn about their rights against eviction and displacement. I also have a minor obsession with the <a href="https://www.nytimes.com/games/connections">NY Times Connections</a>, so much so
          that I've made my own <Link href={`/posts/connections`}>here</Link>. I post a new board every day!</p>
        <p>When I'm
          not working or volunteering, I'm attempting to triangulate Rihanna's
          location on any given night. You can find me on <a href="https://twitter.com/iamrita98">Twitter</a> or check out my <a href="/files/resume_feb_2024.pdf" download>
            resume
          </a>
          .
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
