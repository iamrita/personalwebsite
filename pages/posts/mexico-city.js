import Head from "next/head";
import Layout from "../../components/layout";
import headerFont from "../../components/Font";
import styles from "../../styles/mexicoCity.module.css";

const categories = [
  {
    title: "Food",
    cardClass: styles.food,
    spots: [
      {
        name: "Contramar",
        neighborhood: "Roma Norte",
        description:
          "The best tuna tostadas I've ever had. Go for lunch, sit outside if you can, and order the red and green aguachile to start.",
      },
      {
        name: "El Parnita",
        neighborhood: "Roma Norte",
        description:
          "Late-night tacos that never disappoint. The pastor is the move, especially after a long day of walking around the city.",
      },
      {
        name: "Panadería Rosetta",
        neighborhood: "Roma Norte",
        description:
          "Their guava roll is famous for a reason. I always grab pastries here before a morning in the park.",
      },
      {
        name: "Tacos Orinoco",
        neighborhood: "Condesa",
        description:
          "Simple, perfect taquería energy. The suadero tacos and agua de Jamaica are my go-to order.",
      },
    ],
  },
  {
    title: "Coffee",
    cardClass: styles.coffee,
    spots: [
      {
        name: "Café Avellaneda",
        neighborhood: "Roma Norte",
        description:
          "A cozy spot for a cortado and people-watching. I love starting slow mornings here before exploring the neighborhood.",
      },
      {
        name: "Buna",
        neighborhood: "Juárez",
        description:
          "Thoughtfully sourced coffee with a calm, minimalist vibe. Great for reading or journaling between meetings.",
      },
      {
        name: "Quentin Café",
        neighborhood: "Condesa",
        description:
          "Small and charming with excellent espresso. Perfect pit stop while wandering Parque México.",
      },
    ],
  },
  {
    title: "Neighborhoods",
    cardClass: styles.neighborhoodCard,
    spots: [
      {
        name: "Roma Norte",
        neighborhood: "Cuauhtémoc",
        description:
          "Tree-lined streets, independent bookstores, and some of the best food in the city. I could spend days here without running out of things to do.",
      },
      {
        name: "Condesa",
        neighborhood: "Cuauhtémoc",
        description:
          "Art deco architecture, Parque México, and a relaxed pace that makes it easy to forget you're in one of the world's biggest cities.",
      },
      {
        name: "Coyoacán",
        neighborhood: "Coyoacán",
        description:
          "Cobblestone streets, the Casa Azul, and a village feel that feels worlds away from downtown. I always end up at the market for churros.",
      },
      {
        name: "Juárez",
        neighborhood: "Cuauhtémoc",
        description:
          "Underrated and full of great coffee shops, galleries, and the beautiful Paseo de la Reforma corridor nearby.",
      },
    ],
  },
  {
    title: "Culture",
    cardClass: styles.culture,
    spots: [
      {
        name: "Museo Nacional de Antropología",
        neighborhood: "Chapultepec",
        description:
          "One of the greatest museums I've ever visited. Block out at least half a day — the Aztec sun stone alone is worth the trip.",
      },
      {
        name: "Museo Frida Kahlo",
        neighborhood: "Coyoacán",
        description:
          "The Casa Azul is intimate and moving. Book tickets ahead of time and pair it with a walk through Coyoacán's plaza.",
      },
      {
        name: "Palacio de Bellas Artes",
        neighborhood: "Centro Histórico",
        description:
          "Stunning art nouveau architecture and Diego Rivera murals. The building itself is the main event.",
      },
      {
        name: "MUAC",
        neighborhood: "Coyoacán",
        description:
          "Contemporary art on the UNAM campus. The building is striking, and the exhibitions are always thoughtful.",
      },
    ],
  },
  {
    title: "Outdoors",
    cardClass: styles.outdoors,
    spots: [
      {
        name: "Bosque de Chapultepec",
        neighborhood: "Chapultepec",
        description:
          "Massive urban park with lakes, museums, and miles of paths. My favorite way to reset after a busy week in the city.",
      },
      {
        name: "Parque México",
        neighborhood: "Condesa",
        description:
          "The heart of Condesa. I love the dog parade on weekends and the art deco fountain at the center.",
      },
      {
        name: "Alameda Central",
        neighborhood: "Centro Histórico",
        description:
          "Historic and lively, especially in the evening. Grab a street snack and watch the city go by.",
      },
      {
        name: "Mercado de San Juan",
        neighborhood: "Centro",
        description:
          "Less a park and more an adventure — exotic ingredients, incredible seafood stalls, and some of the best people-watching in CDMX.",
      },
    ],
  },
];

export default function MexicoCity() {
  return (
    <Layout>
      <Head>
        <title>Mexico City Favorites</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>Favorite Spots in Mexico City</h1>
        <p className={styles.intro}>
          Mexico City is one of my favorite places in the world — the food, the
          neighborhoods, the art, and the energy are unmatched. I've visited a
          handful of times and always leave with a longer list of places I want
          to go back to. Below are the spots I keep returning to and recommend
          to anyone visiting CDMX for the first (or fifth) time.
        </p>

        {categories.map((category) => (
          <section key={category.title} className={styles.categorySection}>
            <h2 className={`${headerFont.className} ${styles.categoryTitle}`}>
              {category.title}
            </h2>
            <div className={styles.spotsGrid}>
              {category.spots.map((spot) => (
                <div
                  key={spot.name}
                  className={`${styles.spotCard} ${category.cardClass}`}
                >
                  <h3 className={styles.spotName}>{spot.name}</h3>
                  <span className={styles.neighborhood}>
                    {spot.neighborhood}
                  </span>
                  <p className={styles.spotDescription}>{spot.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </article>
    </Layout>
  );
}
