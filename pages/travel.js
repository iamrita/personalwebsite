import Head from "next/head";
import Layout from "../components/layout";
import headerFont from "../components/Font";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/travel.module.css";
import { buildTwoWeekTravelCalendar } from "../lib/travelSchedule";

export async function getStaticProps() {
  const days = buildTwoWeekTravelCalendar();
  return { props: { days } };
}

export default function Travel({ days }) {
  return (
    <Layout>
      <Head>
        <title>Travel</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>Travel (Next 2 Weeks)</h1>
        <p className={styles.paragraph}>
          This page shows where I expect to be over the next 14 days. Plans can
          change—this is the best current version.
        </p>

        <div className={styles.schedule}>
          {days.map((d) => (
            <div key={d.date} className={styles.dayRow}>
              <div className={styles.date}>{d.label}</div>
              <div>
                <div className={styles.location}>{d.location}</div>
                {d.details ? (
                  <div className={styles.details}>{d.details}</div>
                ) : (
                  <div className={`${styles.details} ${styles.muted}`}>
                    No additional details.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className={`${styles.paragraph} ${utilStyles.fontWeightNormal}`}>
          Want to edit this? Update <code>lib/travelSchedule.js</code>.
        </p>
      </article>
    </Layout>
  );
}

