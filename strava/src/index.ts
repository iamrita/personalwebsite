// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   // logger.info("test", request.params[0])
//   // logger.info("Hello logs!", {structuredData: true});
//   // response.send("Hello from Firebase!");
//     logger.info("Webhook hit", { method: request.method, path: request.path });

//   /* 1 ─── Verification handshake ───────────────────────────── */
//   if (request.method === "GET") {
//     const VERIFY_TOKEN = "myVerifyToken";        // ← use the same string in the curl you send to Strava
//     if (request.query["hub.verify_token"] !== VERIFY_TOKEN) {
//       response.status(403).send("Bad verify token");
//       return;
//     }
//     // Echo the challenge so Strava accepts the subscription
//     response.status(200).json({ "hub.challenge": request.query["hub.challenge"] });
//     return;
//   }

//   /* 2 ─── Activity events (POST) ───────────────────────────── */
//   if (request.method === "POST") {
//     // You could inspect req.body here if you need to
//     response.status(200).send("hooray");
//     return;
//   }

//   /* 3 ─── Anything else ───────────────────────────────────── */
//  response.status(405).send("Method not allowed");
// });

import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import axios from "axios";

/* ───────── Initialise Firestore (emulator-safe) ───────── */
admin.initializeApp();
const db = admin.firestore();


/* =====================================================================
 * 1.  /helloWorld  – Strava Webhook (handshake + activity POST)
 * =================================================================== */
export const helloWorld = onRequest(
  async (req, res): Promise<void> => {
    logger.info("Webhook hit", { method: req.method, path: req.path });

    /* ---- 1-a  Verification handshake (GET) ------------------------- */
    if (req.method === "GET") {
      if (req.query["hub.verify_token"] !== "myVerifyToken") {
        res.status(403).send("Bad verify token");
        return;
      }
      res
        .status(200)
        .json({ "hub.challenge": req.query["hub.challenge"] as string });
      return;
    }

    /* ---- 1-b  Activity POST ---------------------------------------- */
    if (req.method === "POST") {
      res.status(200).send("hooray"); // ACK first so Strava stops retrying

      // OPTIONAL: fetch full activity details with a fresh access token
      try {
        const { object_id } = req.body;
        const token = await getFreshAccessToken();
        const { data: act } = await axios.get(
          `https://www.strava.com/api/v3/activities/${object_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        logger.info(`Fetched activity ${object_id}: ${act.name} ${act.sport_type}`);
      } catch (e) {
        logger.warn("Failed to fetch full activity", e);
      }
      return;
    }

    res.status(405).send("Method not allowed");
  }
);

/* =====================================================================
 * 2.  /stravaOAuth  – handles the browser redirect & stores tokens
 * =================================================================== */
export const stravaOAuth = onRequest(
  async (req, res): Promise<void> => {
    const authCode = req.query.code as string | undefined;
    if (!authCode) {
      res.status(400).send("Missing ?code param");
      return;
    }

    try {
      const body = new URLSearchParams({
        client_id: "157704",
        client_secret: "b04ce64a75ce2efc21d0064da105ceb710a66396",
        grant_type: "authorization_code",
        code: authCode,
        /* redirect_uri is optional as long as host matched */
      });

      // const { data } = await axios.post(
      //   "https://www.strava.com/api/v3/oauth/token",
      //   {
      //     client_id: "157704",
      //     client_secret: "b04ce64a75ce2efc21d0064da105ceb710a66396",
      //     grant_type: "authorization_code",
      //     code: authCode,
      //   }
      // );

      const { data } = await axios.post(
        "https://www.strava.com/api/v3/oauth/token",
        body.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      // Save the trio {access_token, refresh_token, expires_at} in Firestore
      await db.doc("config/stravaTokens").set(data);
      logger.info("Stored new Strava tokens", { athlete: data.athlete?.id });

      res
        .status(200)
        .send(
          "✅ Strava authorised! You can close this tab and test the webhook."
        );
    } catch (err) {
      logger.error("OAuth exchange failed", err);
      res.status(500).send("OAuth token exchange failed – see logs.");
    }
  }
);

/* =====================================================================
 * 3.  Helper – auto-refresh access token when needed
 * =================================================================== */
async function getFreshAccessToken(): Promise<string> {
  const snap = await db.doc("config/stravaTokens").get();
  const tokens = snap.data() as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };

  if (!tokens) throw new Error("Strava tokens not found; run OAuth first");

  if (Date.now() / 1000 < tokens.expires_at - 60) return tokens.access_token;

  const { data } = await axios.post(
    "https://www.strava.com/api/v3/oauth/token",
    {
      client_id:"157704",
      client_secret: "b04ce64a75ce2efc21d0064da105ceb710a66396",
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }
  );

  await snap.ref.set(data);
  return data.access_token;
}
