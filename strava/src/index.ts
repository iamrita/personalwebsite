import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * To test the strava webhook locally you need to run
 * (first compile the typescript using npm run build)
 * then run firebase emulators:start --only functions, firestore
 * then to get the grok you want to run npx ngrok http 5001
 * then go to this link: https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=https://4307-2601-645-c601-69b0-19fb-96dd-a24f-878f.ngrok-free.app/amrita-website/us-central1/stravaOAuth&scope=activity:read_all&approval_prompt=force to authorize strava 
 * 
 * also make sure that your subscription is live 
 * curl -G https://www.strava.com/api/v3/push_subscriptions \
     -d client_id=CLIENT_ID -d client_secret=b04ce64a75ce2efc21d0064da105ceb710a66396 | jq

     curl -X DELETE https://www.strava.com/api/v3/push_subscriptions/281111?client_id=CLIENT_ID& client_secret=CLIENT_SECRET
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
     -F client_id=CLIENT_ID \
     -F client_secret=b04ce64a75ce2efc21d0064da105ceb710a66396 \
     -F callback_url=https://55ff-2601-645-c601-69b0-19fb-96dd-a24f-878f.ngrok-free.app/amrita-website/us-central1/helloWorld \
     -F verify_token=myVerifyToken

 */
admin.initializeApp();
const db = admin.firestore();

const CLIENT_ID = process.env.STRAVA_CLIENT_ID!;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET!;

/* =====================================================================
 * 1.  /helloWorld  – Strava Webhook (handshake + activity POST)
 * =================================================================== */
export const helloWorld = onRequest(async (req, res): Promise<void> => {
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
    try {
      const { object_id } = req.body;
      logger.info(`Created activity with id ${object_id}`)
      const token = await getFreshAccessToken();
      const { data: act } = await axios.get(
        `https://www.strava.com/api/v3/activities/${object_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      logger.info(
        `Fetched activity ${object_id}: ${act.name} ${act.sport_type}`
      );

      try {
        // Write to Firestore:
        await db.collection("activities").doc(object_id.toString()).set({
          name: act.name,
          sportType: act.sport_type,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (e) {
        logger.error("Failed to write activity data", e);
      }

      logger.info(`Saved activity ${object_id} (${act.sport_type})`);
    } catch (e) {
      logger.warn(`Failed to fetch full activity`, e);
    }
    return;
  }

  res.status(405).send("Method not allowed");
});

/* =====================================================================
 * 2.  /stravaOAuth  – handles the browser redirect & stores tokens
 * =================================================================== */
export const stravaOAuth = onRequest(async (req, res): Promise<void> => {
  const authCode = req.query.code as string | undefined;
  if (!authCode) {
    res.status(400).send("Missing ?code param");
    return;
  }

  try {
    const body = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code: authCode,
      /* redirect_uri is optional as long as host matched */
    });

    const { data } = await axios.post(
      "https://www.strava.com/api/v3/oauth/token",
      body.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Save the trio {access_token, refresh_token, expires_at} in Firestore
    try {
      await db.doc("config/stravaTokens").set(data); // ok so I learned that in order for this to work, the database on firestore needs to be named (default)
      logger.info("Stored new Strava tokens", { athlete: data.athlete?.id });
    } catch (e) {
      logger.error("Failed to store tokens", e);
      res.status(500).send("Failed to store tokens");
      return;
    }

    res
      .status(200)
      .send(
        "✅ Strava authorised! You can close this tab and test the webhook."
      );
  } catch (err) {
    logger.error("OAuth exchange failed", err);
    res.status(500).send("OAuth token exchange failed – see logs.");
  }
});

/**
 *
 * @returns Promise
 */
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
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }
  );

  await snap.ref.set(data);
  return data.access_token;
}
