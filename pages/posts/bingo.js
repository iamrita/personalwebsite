import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/bingo.module.css";
import headerFont from "../../components/Font";
import "../../components/firebase";

// Personalized bingo goals based on Amrita's interests
const bingoGoals = [
  "Lead climb a 5.10",
  "Read 20 books",
  "Volunteer 50+ hours at SF Tenants Union",
  "Complete a half marathon",
  "Write 5 blog posts",
  "Try 10 new SF restaurants",
  "Learn a new climbing technique",
  "Finish 3 puzzle games",
  "Go on 5 hikes outside SF",
  "Attend a tech conference",
  "Organize a friend gathering",
  "Try a new sport",
  "Read a book in a new genre",
  "Explore 3 new SF neighborhoods",
  "Complete a multi-pitch climb",
  "Write about SF Tenants Union work",
  "Run 100 miles total",
  "Finish a video game with partner",
  "Try bouldering outdoors",
  "Read 3 non-fiction books",
  "Volunteer at a new organization",
  "Climb at 3 different gyms",
  "Write a personal essay",
  "Complete a cycling event",
  "Host a book club meeting",
];

export default function Bingo() {
  const [completed, setCompleted] = useState({});
  const [bingoLines, setBingoLines] = useState([]);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("newYearBingo2025");
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved bingo state:", e);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("newYearBingo2025", JSON.stringify(completed));
    checkBingo();
  }, [completed]);

  const toggleGoal = (index) => {
    setCompleted((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const checkBingo = () => {
    const lines = [];
    const gridSize = 5;

    // Check rows
    for (let row = 0; row < gridSize; row++) {
      let isComplete = true;
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col;
        if (!completed[index]) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        lines.push(`row-${row}`);
      }
    }

    // Check columns
    for (let col = 0; col < gridSize; col++) {
      let isComplete = true;
      for (let row = 0; row < gridSize; row++) {
        const index = row * gridSize + col;
        if (!completed[index]) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        lines.push(`col-${col}`);
      }
    }

    // Check diagonal (top-left to bottom-right)
    let isComplete = true;
    for (let i = 0; i < gridSize; i++) {
      const index = i * gridSize + i;
      if (!completed[index]) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      lines.push("diag-1");
    }

    // Check diagonal (top-right to bottom-left)
    isComplete = true;
    for (let i = 0; i < gridSize; i++) {
      const index = i * gridSize + (gridSize - 1 - i);
      if (!completed[index]) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      lines.push("diag-2");
    }

    setBingoLines(lines);
  };

  const resetBingo = () => {
    if (confirm("Are you sure you want to reset your bingo board?")) {
      setCompleted({});
      setBingoLines([]);
      localStorage.removeItem("newYearBingo2025");
    }
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <Layout>
      <Head>
        <title>New Year&apos;s Bingo 2025</title>
      </Head>
      <article>
        <h1 className={headerFont.className}>New Year&apos;s Bingo 2025</h1>
        <p className={styles.description}>
          A personalized bingo board of goals for the year ahead! Click on any
          square to mark it as complete. Your progress is saved automatically.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{completedCount}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{bingoLines.length}</span>
            <span className={styles.statLabel}>Bingo Lines</span>
          </div>
        </div>
        {bingoLines.length > 0 && (
          <div className={styles.bingoAlert}>
            🎉 BINGO! You&apos;ve completed {bingoLines.length} line
            {bingoLines.length > 1 ? "s" : ""}! 🎉
          </div>
        )}
        <div className={styles.bingoGrid}>
          {bingoGoals.map((goal, index) => {
            const isCompleted = completed[index];
            const row = Math.floor(index / 5);
            const col = index % 5;
            const hasRowBingo = bingoLines.includes(`row-${row}`);
            const hasColBingo = bingoLines.includes(`col-${col}`);
            const hasDiag1Bingo =
              row === col && bingoLines.includes("diag-1");
            const hasDiag2Bingo =
              row + col === 4 && bingoLines.includes("diag-2");
            const hasBingoLine =
              hasRowBingo || hasColBingo || hasDiag1Bingo || hasDiag2Bingo;

            return (
              <div
                key={index}
                className={`${styles.bingoSquare} ${
                  isCompleted ? styles.completed : ""
                } ${hasBingoLine ? styles.bingoLine : ""}`}
                onClick={() => toggleGoal(index)}
              >
                <div className={styles.squareContent}>
                  {isCompleted && <span className={styles.checkmark}>✓</span>}
                  <span className={styles.goalText}>{goal}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.actions}>
          <button onClick={resetBingo} className={styles.resetButton}>
            Reset Board
          </button>
        </div>
        <p className={styles.footer}>
          <em>
            Here&apos;s to a year filled with climbing, reading, volunteering,
            and all the things that make you happy! Good luck! 🎯
          </em>
        </p>
      </article>
    </Layout>
  );
}
