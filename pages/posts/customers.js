import Layout from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/customers.module.css";
import headerFont from "../../components/Font";

const customers = [
  {
    name: "Acme Corp",
    industry: "Technology",
    detail:
      "Helped the engineering team integrate Cursor into their CI/CD pipeline. Great conversations about developer productivity and AI-assisted code reviews.",
    visitDate: "March 2026",
  },
  {
    name: "Meridian Health",
    industry: "Healthcare",
    detail:
      "Worked with their data science group on setting up Cursor for HIPAA-compliant workflows. They had a really interesting approach to medical record analysis.",
    visitDate: "February 2026",
  },
  {
    name: "Redwood Financial",
    industry: "Finance",
    detail:
      "Onboarded their quantitative trading team. They were excited about using Cursor's AI features for rapid prototyping of trading strategies.",
    visitDate: "January 2026",
  },
  {
    name: "Solaris Education",
    industry: "Education",
    detail:
      "Visited their campus to demo Cursor to CS professors and students. The interactive coding session was a highlight — students loved the tab completion.",
    visitDate: "December 2025",
  },
  {
    name: "NovaBuild Construction",
    industry: "Construction Tech",
    detail:
      "Their team builds internal tools for project management. We walked through how Cursor can speed up full-stack development for non-traditional tech companies.",
    visitDate: "November 2025",
  },
  {
    name: "Atlas Logistics",
    industry: "Logistics",
    detail:
      "Met with their platform engineering team about scaling Cursor across 200+ developers. Discussed workspace configuration and shared prompts.",
    visitDate: "October 2025",
  },
];

export default function Customers() {
  return (
    <Layout>
      <Head>
        <title>Customer Visits</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>Customer Visits</h1>
        <p className={styles.paragraph}>
          As a Field Engineer at Cursor, I get to visit some amazing companies
          and work directly with their engineering teams. Below is a log of some
          of the customers I&apos;ve had the pleasure of visiting. Each visit is
          a chance to learn about how different teams build software and to help
          them get the most out of Cursor.
        </p>
        <div className={styles.customerGrid}>
          {customers.map((customer) => (
            <div key={customer.name} className={styles.customerCard}>
              <div className={styles.customerName}>{customer.name}</div>
              <div className={styles.customerIndustry}>
                {customer.industry}
              </div>
              <div className={styles.customerDetail}>{customer.detail}</div>
              <span className={styles.visitDate}>{customer.visitDate}</span>
            </div>
          ))}
        </div>
      </article>
    </Layout>
  );
}
