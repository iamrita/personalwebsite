import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../components/firebase";
import Layout, { siteTitle } from "../../components/layout";
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
  Workout: "/images/workout.png",
  Walk: "/images/workout.png",
  Run: "/images/workout.png",
  Hike: "/images/workout.png",
  Yoga: "/images/yoga.png",
  Ride: "/images/cycling.png",
  VirtualRide: "/images/cycling.png",
  HighIntensityIntervalTraining: "/images/boxing.png",
  Swim: "/images/swimming.png",
  RockClimbing: "/images/climbing.png",
  WeightTraining: "/images/weightlifting.png",
};

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

export default function Activities() {
  const [sports, setSports] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState({});
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

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const weeks = generateCalendar(year, month);

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
        <h1 className={headerFont.className}>Latest activity</h1>
        <div className="calendar">
          <div className="week">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="cell header">
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="week">
              {week.map((day, di) => (
                <div key={di} className="cell">
                  {day &&
                    sports
                      .filter(
                        (activity) =>
                          activity.date.getFullYear() === year &&
                          activity.date.getMonth() === month &&
                          activity.date.getDate() === day
                      )
                      .map((activity, idx, arr) => (
                        <img
                          key={idx}
                          src={sportsMap[activity.sportType]}
                          alt={activity.sportType}
                          className="activity-img"
                          style={{
                            zIndex:
                              (idx -
                                (selectedIndices[`${year}-${month}-${day}`] ||
                                  0) +
                                arr.length) %
                              arr.length,
                          }}
                          onClick={() =>
                            handleClick(`${year}-${month}-${day}`, arr.length)
                          }
                        />
                      ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </article>
      <style jsx>{`
        .calendar {
          display: grid;
          grid-template-rows: auto repeat(${weeks.length}, auto);
          gap: 8px;
        }
        .week {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .cell {
          min-height: 80px;
          padding: 4px;
          position: relative;
        }
        .cell.header {
          min-height: 20px;
          font-weight: bold;
          text-align: center;
          background-color: transparent;
          padding-bottom: 2px; /* Reduced padding at the bottom */
        }
        .activity-img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70px;
          height: 70px;
          cursor: pointer;
          transition: transform 0.2s, z-index 0.2s;
        }
      `}</style>
    </Layout>
  );
}
