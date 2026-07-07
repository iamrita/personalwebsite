import Layout from "../../components/layout";
import Head from "next/head";
import headerFont from "../../components/Font";
import styles from "../../styles/weekend.module.css";
import { useState, useEffect, useCallback, useRef } from "react";

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const CLIENT_ID =
  "773951288107-iq7t5e39m3v5t0s3q97bjnq2j9f5k56r.apps.googleusercontent.com";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

function getUpcomingWeekend() {
  const now = new Date();
  const day = now.getDay();

  let satOffset, sunOffset;
  if (day === 6) {
    satOffset = 0;
    sunOffset = 1;
  } else if (day === 0) {
    satOffset = -1;
    sunOffset = 0;
  } else {
    satOffset = 6 - day;
    sunOffset = 7 - day;
  }

  const saturday = new Date(now);
  saturday.setDate(now.getDate() + satOffset);
  saturday.setHours(0, 0, 0, 0);

  const sunday = new Date(now);
  sunday.setDate(now.getDate() + sunOffset);
  sunday.setHours(23, 59, 59, 999);

  return { saturday, sunday };
}

function formatTime(dateString) {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDateHeading(date) {
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function groupEventsByDay(events, saturday) {
  const satDate = saturday.toDateString();
  const satEvents = [];
  const sunEvents = [];

  for (const event of events) {
    const start = event.start.dateTime || event.start.date;
    const eventDate = new Date(start).toDateString();
    if (eventDate === satDate) {
      satEvents.push(event);
    } else {
      sunEvents.push(event);
    }
  }

  return { satEvents, sunEvents };
}

function EventCard({ event }) {
  const isAllDay = !event.start.dateTime;
  const startTime = event.start.dateTime
    ? formatTime(event.start.dateTime)
    : null;
  const endTime = event.end.dateTime ? formatTime(event.end.dateTime) : null;

  return (
    <div className={styles.eventCard}>
      <div className={styles.eventTime}>
        {isAllDay ? (
          <span className={styles.allDayBadge}>All day</span>
        ) : (
          <>
            {startTime}
            {endTime ? ` - ${endTime}` : ""}
          </>
        )}
      </div>
      <div className={styles.eventDetails}>
        <p className={styles.eventTitle}>{event.summary || "(No title)"}</p>
        {event.location && (
          <p className={styles.eventLocation}>{event.location}</p>
        )}
        {event.description && (
          <p className={styles.eventDescription}>
            {event.description.length > 120
              ? event.description.slice(0, 120) + "..."
              : event.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Weekend() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const tokenClientRef = useRef(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { saturday, sunday } = getUpcomingWeekend();
      const response = await window.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: saturday.toISOString(),
        timeMax: sunday.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 50,
      });
      setEvents(response.result.items || []);
    } catch (err) {
      setError(
        err?.result?.error?.message || "Failed to fetch calendar events."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadGapi = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.gapi.load("client", async () => {
          await window.gapi.client.init({
            discoveryDocs: [DISCOVERY_DOC],
          });
          setGapiReady(true);
        });
      };
      document.head.appendChild(script);
    };

    const loadGis = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGisReady(true);
      };
      document.head.appendChild(script);
    };

    loadGapi();
    loadGis();
  }, []);

  useEffect(() => {
    if (!gapiReady || !gisReady) return;

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          setError("Authorization failed. Please try again.");
          return;
        }
        setIsSignedIn(true);
        fetchEvents();
      },
    });
  }, [gapiReady, gisReady, fetchEvents]);

  const handleSignIn = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: "consent" });
    }
  };

  const handleSignOut = () => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken(null);
    }
    setIsSignedIn(false);
    setEvents(null);
  };

  const { saturday, sunday } = getUpcomingWeekend();
  const grouped = events ? groupEventsByDay(events, saturday) : null;

  return (
    <Layout>
      <Head>
        <title>Weekend Plans</title>
      </Head>

      <article className={styles.container}>
        <div className={styles.headerRow}>
          <h1 className={headerFont.className}>Weekend Plans</h1>
          {isSignedIn && (
            <button onClick={handleSignOut} className={styles.signOutButton}>
              Sign out
            </button>
          )}
        </div>

        {!isSignedIn ? (
          <div className={styles.signInContainer}>
            <p>
              Connect your Google Calendar to see what you have planned for the
              upcoming weekend.
            </p>
            <button
              onClick={handleSignIn}
              className={styles.signInButton}
              disabled={!gapiReady || !gisReady}
            >
              {gapiReady && gisReady
                ? "Sign in with Google"
                : "Loading..."}
            </button>
          </div>
        ) : loading ? (
          <div className={styles.loading}>
            <span className={styles.spinner} />
            Fetching your weekend events...
          </div>
        ) : error ? (
          <div className={styles.errorBox}>{error}</div>
        ) : grouped ? (
          <>
            <p className={styles.weekendLabel}>
              {formatDateHeading(saturday)} &ndash;{" "}
              {formatDateHeading(sunday)}
            </p>

            <div className={styles.daySection}>
              <h2 className={`${styles.dayHeading} ${headerFont.className}`}>
                Saturday
              </h2>
              {grouped.satEvents.length > 0 ? (
                grouped.satEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className={styles.emptyDay}>
                  Nothing planned &mdash; enjoy the free time!
                </div>
              )}
            </div>

            <div className={styles.daySection}>
              <h2 className={`${styles.dayHeading} ${headerFont.className}`}>
                Sunday
              </h2>
              {grouped.sunEvents.length > 0 ? (
                grouped.sunEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className={styles.emptyDay}>
                  Nothing planned &mdash; enjoy the free time!
                </div>
              )}
            </div>
          </>
        ) : null}

        <div className={styles.infoBox}>
          This page connects to the Google Calendar API to show your upcoming
          weekend events. Your calendar data is fetched directly in the browser
          and is never stored on any server. Sign in with your Google account to
          get started!
        </div>
      </article>
    </Layout>
  );
}
