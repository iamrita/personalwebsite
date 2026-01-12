import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../components/firebase";
import Layout, { siteTitle } from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/activities.module.css";

import Head from "next/head";
import { useState, useEffect } from "react";
import headerFont from "../../components/Font";

// Helper to generate calendar grid for current month
function generateCalendar(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalSlots = firstDayIndex + daysInMonth;
  const weeks = [];
  let current = 0;

  while (current < totalSlots) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dayIndex = current - firstDayIndex + 1;
      if (current < firstDayIndex || dayIndex > daysInMonth) {
        week.push(null);
      } else {
        week.push(dayIndex);
      }
      current++;
    }
    weeks.push(week);
  }
  return weeks;
}
const sportsMap = {
  Workout: "/images/weightlifting-paris.png",
  Walk: "/images/running-paris.png",
  Run: "/images/running-paris.png",
  Hike: "/images/hiking-paris.png",
  Yoga: "/images/yoga-paris.png",
  Ride: "/images/cycling-paris.png",
  EBikeRide: "/images/cycling-paris.png",
  VirtualRide: "/images/cycling-paris.png",
  HighIntensityIntervalTraining: "/images/boxing-paris.png",
  Swim: "/images/swimming-paris.png",
  RockClimbing: "/images/climbing-paris.png",
  WeightTraining: "/images/weightlifting-paris.png",
  Tennis: "/images/tennis-paris.png",
  Volleyball: "/images/volleyball-paris.png",
};
// test
const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

export default function Activities() {
  const [sports, setSports] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Query the most recent activity
    const q = query(collection(db, "activities"), orderBy("timestamp", "asc"));

    // Real-time:
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((doc) => {
        const data = doc.data();
        const dateObj = data.timestamp.toDate();
        return {
          date: dateObj,
          sportType: data.sportType,
        };
      });
      setSports(items);
    });
    return () => unsub();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = generateCalendar(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleClick = (dateKey, length) => {
    setSelectedIndices((prev) => ({
      ...prev,
      [dateKey]: ((prev[dateKey] || 0) + 1) % length,
    }));
  };

  return (
    <Layout>
      <Head>
        <title>Activities</title>{" "}
      </Head>

      <article>
        <div className={styles.monthNavigation}>
          <button onClick={handlePrevMonth} className={styles.navButton}>
            ←
          </button>
          <h1 className={headerFont.className}>
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </h1>
          <button onClick={handleNextMonth} className={styles.navButton}>
            →
          </button>
        </div>
        <div
          className={styles.calendar}
          style={{ "--weeks-count": weeks.length }}
        >
          <div className={styles.week}>
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className={`${styles.cell} ${styles.cellHeader}`}>
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className={styles.week}>
              {week.map((day, di) => (
                <div key={di} className={styles.cell}>
                  {day &&
                    (() => {
                      const dayActivities = sports
                        .filter(
                          (activity) =>
                            activity.date.getFullYear() === year &&
                            activity.date.getMonth() === month &&
                            activity.date.getDate() === day
                        )
                        .sort((a, b) => a.date.getTime() - b.date.getTime());

                      if (dayActivities.length === 0) return null;

                      const selectedIndex =
                        selectedIndices[`${year}-${month}-${day}`] || 0;
                      const currentActivity = dayActivities[selectedIndex];
                      const isClickable = dayActivities.length > 1;

                      return (
                        <img
                          src={sportsMap[currentActivity.sportType]}
                          alt={currentActivity.sportType}
                          className={`${styles.activityImg} ${
                            isClickable ? styles.activityImgClickable : ""
                          }`}
                          onClick={() =>
                            isClickable &&
                            handleClick(
                              `${year}-${month}-${day}`,
                              dayActivities.length
                            )
                          }
                        />
                      );
                    })()}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className={styles.paragraph}>
          The goal of this page was three fold - to experiment with Firebase
          cloud functions, to try out the Strava Webhook API, and to have a fun
          way of tracking all the different activities I do throughout the
          month. Right now, I have set up a webhook so that whenever I post on
          Strava, my cloud function will trigger and add that activity to my
          Firestore database. My website reads from this database, and based on
          what type of activity I do, a different image will show on the
          calendar. If I happen to do multiple activities on the same day (not
          often), I can click on the image to cycle through them.
        </p>
        <p className={styles.paragraph}>
          <em>
            Curious where these beautiful images come from? They're the official
            pictograms from the 2024 Paris Olympic Games. If you love great
            design and art like I do, Olympic pictograms are a perfect blend of
            history, tradition, and visual communication! First introduced at
            the 1924 Paris and 1948 London Games, these sleek, language-free
            symbols were crafted by the Olympics organizers to guide
            spectators—no matter their native tongue—by delivering information
            in the clearest, most intuitive way. There's a rich and fascinating
            story behind how these symbols evolved over the decades—I highly
            recommend reading about the history of Olympic pictograms{" "}
            <a
              href="https://www.theolympicdesign.com/olympic-games/pictograms/"
              className={utilStyles.link}
            >
              here
            </a>{" "}
            and see how the pictograms have changed over the years!. I plan to
            change up the pictograms I use every month, but I started with this
            one because it was the most recent.
          </em>
        </p>
        <p className={styles.paragraph}>
          <em>
            Because there are some sports on Strava that don't have a
            corresponding Olympic sport (like yoga), I've taken the artistic
            challenge to create them in the same style! Stay tuned to see what I
            come up with :)
          </em>
        </p>
      </article>
    </Layout>
  );
}
