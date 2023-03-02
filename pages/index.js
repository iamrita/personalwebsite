import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts';
import Date from '../components/date'


export async function getStaticProps() {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    }
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p> Hi! My name is <a href="https://www.linkedin.com/in/amritavenkatraman/">Amrita</a>. I recently graduated from Stanford University, where I studied Computer Science and Psychology. I love reading, writing, and Rihanna.
          I currently live in San Francisco, California. You can find me on <a href="https://twitter.com/iamrita98">Twitter</a> or check out my <a href="/files/resume_feb_2023.pdf" download>resume</a>. You can also read <Link href={`/posts/thoughts`}>more</Link> about how I built this website.
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
  )
}
