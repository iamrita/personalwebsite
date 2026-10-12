import { defineString } from "firebase-functions/params";

/**
 * Numeric Goodreads user id for the public shelf RSS feeds.
 * This is the only place that id lives. Override at deploy time with
 * GOODREADS_USER_ID (functions/goodreads/.env or the Cloud Functions env).
 */
export const goodreadsUserId = defineString("GOODREADS_USER_ID", {
  default: "118336006",
  description: "Numeric Goodreads user id for the public shelf RSS feeds.",
});

export const READING_COLLECTION = "reading";
export const STATUS_DOC_ID = "status";
/** How many finished books to keep. The homepage shows every stored one. */
export const RECENTLY_READ_LIMIT = 2;
export const SYNC_SCHEDULE = "every 6 hours";
