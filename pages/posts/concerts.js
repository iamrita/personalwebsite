import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import headerFont from "../../components/Font";
import utilStyles from "../../styles/utils.module.css";
import styles from "../../styles/concerts.module.css";
import { differenceInCalendarDays, format, isPast } from "date-fns";

const STORAGE_KEY = "amrita-concerts";

const seedConcerts = [
  {
    id: "seed-1",
    artist: "Japanese Breakfast",
    venue: "The Fillmore",
    city: "San Francisco, CA",
    date: "2026-09-12",
    ticketUrl: "",
    notes: "General admission — bring earplugs!",
  },
  {
    id: "seed-2",
    artist: "Khruangbin",
    venue: "Greek Theatre",
    city: "Berkeley, CA",
    date: "2026-10-03",
    ticketUrl: "",
    notes: "",
  },
];

function createId() {
  return `concert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseConcertDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function sortByDateAsc(concerts) {
  return [...concerts].sort(
    (a, b) => parseConcertDate(a.date).getTime() - parseConcertDate(b.date).getTime()
  );
}

function formatCountdown(dateString) {
  const days = differenceInCalendarDays(parseConcertDate(dateString), new Date());
  if (days < 0) return "Already happened";
  if (days === 0) return "Tonight!";
  if (days === 1) return "Tomorrow";
  return `${days} days away`;
}

function ConcertDateBadge({ dateString }) {
  const date = parseConcertDate(dateString);
  return (
    <div className={styles.concertDate}>
      <span className={styles.concertDateMonth}>{format(date, "MMM")}</span>
      <span className={styles.concertDateDay}>{format(date, "d")}</span>
    </div>
  );
}

function ConcertCard({ concert, isPastConcert, onDelete }) {
  return (
    <article
      className={`${styles.concertCard} ${
        isPastConcert ? styles.concertCardPast : ""
      }`}
    >
      <div className={styles.concertHeader}>
        <h3 className={`${styles.concertArtist} ${headerFont.className}`}>
          {concert.artist}
        </h3>
        <ConcertDateBadge dateString={concert.date} />
      </div>
      <p className={styles.concertVenue}>
        {concert.venue}
        {concert.city ? ` · ${concert.city}` : ""}
      </p>
      {concert.notes ? (
        <p className={styles.concertNotes}>{concert.notes}</p>
      ) : null}
      <div className={styles.concertActions}>
        {concert.ticketUrl ? (
          <a
            href={concert.ticketUrl}
            className={styles.ticketLink}
            target="_blank"
            rel="noreferrer"
          >
            View tickets
          </a>
        ) : null}
        <button
          type="button"
          className={`${styles.actionButton} ${styles.deleteButton}`}
          onClick={() => onDelete(concert.id)}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default function Concerts() {
  const [concerts, setConcerts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [form, setForm] = useState({
    artist: "",
    venue: "",
    city: "",
    date: "",
    ticketUrl: "",
    notes: "",
  });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConcerts(JSON.parse(stored));
      } else {
        setConcerts(seedConcerts);
      }
    } catch {
      setConcerts(seedConcerts);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(concerts));
  }, [concerts, hasLoaded]);

  const { upcoming, past } = useMemo(() => {
    const sorted = sortByDateAsc(concerts);
    return {
      upcoming: sorted.filter((concert) => !isPast(parseConcertDate(concert.date))),
      past: sorted
        .filter((concert) => isPast(parseConcertDate(concert.date)))
        .reverse(),
    };
  }, [concerts]);

  const nextConcert = upcoming[0] ?? null;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.artist.trim() || !form.venue.trim() || !form.date) return;

    const newConcert = {
      id: createId(),
      artist: form.artist.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      date: form.date,
      ticketUrl: form.ticketUrl.trim(),
      notes: form.notes.trim(),
    };

    setConcerts((current) => sortByDateAsc([...current, newConcert]));
    setForm({
      artist: "",
      venue: "",
      city: "",
      date: "",
      ticketUrl: "",
      notes: "",
    });
  }

  function handleDelete(id) {
    setConcerts((current) => current.filter((concert) => concert.id !== id));
  }

  return (
    <Layout>
      <Head>
        <title>Concerts</title>
      </Head>

      <h1 className={headerFont.className}>Upcoming Concerts</h1>

      <p className={styles.intro}>
        A little page to keep track of shows I&apos;m excited about. Add concerts
        below and they&apos;ll stick around in your browser — perfect for planning
        nights out in the Bay Area.
      </p>

      {nextConcert ? (
        <section className={styles.nextConcert}>
          <p className={styles.nextConcertLabel}>Next up</p>
          <h2 className={`${styles.nextConcertArtist} ${headerFont.className}`}>
            {nextConcert.artist}
          </h2>
          <p className={styles.nextConcertMeta}>
            {format(parseConcertDate(nextConcert.date), "EEEE, MMMM d, yyyy")} ·{" "}
            {nextConcert.venue}
            {nextConcert.city ? ` · ${nextConcert.city}` : ""}
          </p>
          <span className={styles.countdown}>
            {formatCountdown(nextConcert.date)}
          </span>
        </section>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label htmlFor="artist">Artist</label>
            <input
              id="artist"
              name="artist"
              value={form.artist}
              onChange={handleChange}
              placeholder="Who are you seeing?"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label htmlFor="venue">Venue</label>
            <input
              id="venue"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="The Fillmore"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="ticketUrl">Ticket link (optional)</label>
          <input
            id="ticketUrl"
            name="ticketUrl"
            type="url"
            value={form.ticketUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Who you're going with, setlist hopes, etc."
          />
        </div>

        <button type="submit" className={styles.addButton}>
          Add concert
        </button>
      </form>

      <h2 className={`${styles.sectionTitle} ${headerFont.className}`}>
        On the calendar
      </h2>
      {upcoming.length > 0 ? (
        <div className={styles.concertList}>
          {upcoming.map((concert) => (
            <ConcertCard
              key={concert.id}
              concert={concert}
              isPastConcert={false}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>
          No upcoming concerts yet. Add one above to start your list.
        </p>
      )}

      {past.length > 0 ? (
        <>
          <h2 className={`${styles.sectionTitle} ${headerFont.className}`}>
            Past shows
          </h2>
          <div className={styles.concertList}>
            {past.map((concert) => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                isPastConcert
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      ) : null}

      <p className={styles.intro} style={{ marginTop: "32px" }}>
        Looking for more to do? Check out my{" "}
        <a href="/posts/activities" className={utilStyles.link}>
          activity calendar
        </a>{" "}
        too.
      </p>
    </Layout>
  );
}
