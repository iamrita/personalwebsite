import Layout from "../../components/layout";
import Head from "next/head";
import styles from "../../styles/videogames.module.css";
import headerFont from "../../components/Font";

const games = [
  {
    title: "Call of the Sea",
    platform: "PlayStation 5",
    emoji: "\uD83C\uDF0A",
    status: "playing",
    description:
      "A puzzle adventure set in the 1930s South Pacific. My partner and I have been playing through this together — the art direction and atmosphere are gorgeous.",
  },
  {
    title: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo Switch",
    emoji: "\uD83D\uDDE1\uFE0F",
    status: "completed",
    description:
      "An absolute masterpiece. The Ultrahand mechanic alone kept me entertained for dozens of hours building ridiculous contraptions.",
  },
  {
    title: "Hades",
    platform: "Nintendo Switch",
    emoji: "\uD83D\uDD25",
    status: "completed",
    description:
      "Supergiant's roguelike that somehow makes dying fun. The storytelling woven into the gameplay loop is unlike anything else.",
  },
  {
    title: "Stardew Valley",
    platform: "PC",
    emoji: "\uD83C\uDF3E",
    status: "on-hold",
    description:
      "The ultimate cozy game. I keep coming back to my farm every few months when I need something relaxing.",
  },
  {
    title: "Celeste",
    platform: "Nintendo Switch",
    emoji: "\u26F0\uFE0F",
    status: "completed",
    description:
      "A beautiful and brutally precise platformer with one of the best narratives about mental health in any game.",
  },
  {
    title: "It Takes Two",
    platform: "PlayStation 5",
    emoji: "\uD83D\uDC65",
    status: "completed",
    description:
      "A co-op game that reinvents itself every level. Played through the whole thing in a weekend — every chapter feels like a different game.",
  },
  {
    title: "Hollow Knight",
    platform: "PC",
    emoji: "\uD83E\uDEB2",
    status: "on-hold",
    description:
      "Stunning hand-drawn art in a massive interconnected world. I got lost in the best way possible exploring every corner of Hallownest.",
  },
  {
    title: "Animal Crossing: New Horizons",
    platform: "Nintendo Switch",
    emoji: "\uD83C\uDFDD\uFE0F",
    status: "completed",
    description:
      "My pandemic island getaway. Spent way too many hours designing my island and visiting friends.",
  },
];

const statusLabel = {
  playing: "Currently Playing",
  completed: "Completed",
  "on-hold": "On Hold",
};

const statusClass = {
  playing: styles.statusPlaying,
  completed: styles.statusCompleted,
  "on-hold": styles.statusOnHold,
};

function groupByStatus(games) {
  const order = ["playing", "completed", "on-hold"];
  const groups = {};
  for (const s of order) {
    groups[s] = games.filter((g) => g.status === s);
  }
  return groups;
}

export default function VideoGames() {
  const grouped = groupByStatus(games);

  return (
    <Layout>
      <Head>
        <title>Video Games</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>Video Games</h1>
        <p className={styles.paragraph}>
          Gaming is one of my favorite ways to unwind. Whether it&apos;s
          exploring vast open worlds, solving puzzles with my partner, or dying
          for the hundredth time in a roguelike, I love games that tell great
          stories and have satisfying mechanics. Here&apos;s what I&apos;ve been
          playing!
        </p>
        {Object.entries(grouped).map(
          ([status, statusGames]) =>
            statusGames.length > 0 && (
              <div key={status}>
                <h2 className={`${headerFont.className} ${styles.sectionLabel}`}>
                  {statusLabel[status]}
                </h2>
                <div className={styles.gameList}>
                  {statusGames.map((game) => (
                    <div key={game.title} className={styles.gameCard}>
                      <div className={styles.gameEmoji}>{game.emoji}</div>
                      <div className={styles.gameInfo}>
                        <div className={styles.gameTitle}>{game.title}</div>
                        <div className={styles.gamePlatform}>
                          {game.platform}
                        </div>
                        <div className={styles.gameDescription}>
                          {game.description}
                        </div>
                        <span
                          className={`${styles.statusBadge} ${statusClass[game.status]}`}
                        >
                          {statusLabel[game.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </article>
    </Layout>
  );
}
