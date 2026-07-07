import Head from "next/head";
import Layout from "../../components/layout";
import headerFont from "../../components/Font";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/sf-spots.module.css";

const favoriteSpots = [
  {
    name: "Arsicault Bakery",
    neighborhood: "Inner Richmond",
    type: "Bakery",
    favoriteOrder: "Almond croissant",
    note: "The laminated pastries are worth the early line every single time.",
    link: "https://www.arsicault-bakery.com/",
  },
  {
    name: "Lands End Trail",
    neighborhood: "Outer Richmond",
    type: "Scenic walk",
    favoriteOrder: "Sunset loop to the Labyrinth",
    note: "A quick reset with ocean views, cypress trees, and Golden Gate peeks.",
    link: "https://www.parksconservancy.org/parks/lands-end",
  },
  {
    name: "Kantine",
    neighborhood: "Lower Haight",
    type: "Cafe",
    favoriteOrder: "Open-face gravlax sandwich",
    note: "Cozy Nordic cafe with bright flavors and excellent coffee.",
    link: "https://www.kantinesf.com/",
  },
  {
    name: "The Mill",
    neighborhood: "Divisadero",
    type: "Cafe",
    favoriteOrder: "Thick-cut cinnamon toast and a cappuccino",
    note: "A reliable spot for excellent coffee, house-milled flour, and warm toast.",
    link: "https://www.themillsf.com/",
  },
  {
    name: "B. Patisserie",
    neighborhood: "Pacific Heights",
    type: "Bakery",
    favoriteOrder: "Kouign-amann",
    note: "Buttery, caramelized, and dangerously easy to eat in one minute.",
    link: "https://bpatisserie.com/",
  },
  {
    name: "Crissy Field",
    neighborhood: "Presidio",
    type: "Park",
    favoriteOrder: "Morning walk with coffee in hand",
    note: "A calm waterfront path with unbeatable bridge and bay views.",
    link: "https://presidio.gov/explore/attractions/crissy-field",
  },
  {
    name: "Saru Sushi Bar",
    neighborhood: "Noe Valley",
    type: "Dinner spot",
    favoriteOrder: "Chef's nigiri selection",
    note: "Consistently fresh fish and a quiet space for a relaxed dinner.",
    link: "https://www.sarusushi.com/",
  },
];

export default function SfSpots() {
  return (
    <Layout>
      <Head>
        <title>Favorite Spots in San Francisco</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>Favorite Spots in San Francisco</h1>
        <p className={styles.intro}>
          This is my always-growing list of places I love around the city. I
          usually send this to friends when they ask where they should spend a
          free afternoon in SF.
        </p>
        <div className={styles.grid}>
          {favoriteSpots.map((spot) => (
            <section className={styles.card} key={spot.name}>
              <p className={styles.type}>{spot.type}</p>
              <h2 className={styles.title}>{spot.name}</h2>
              <p className={styles.neighborhood}>{spot.neighborhood}</p>
              <p className={styles.copy}>{spot.note}</p>
              <p className={styles.order}>
                <strong>Go-to:</strong> {spot.favoriteOrder}
              </p>
              <a
                href={spot.link}
                target="_blank"
                rel="noreferrer"
                className={utilStyles.link}
              >
                Visit website
              </a>
            </section>
          ))}
        </div>
      </article>
    </Layout>
  );
}
