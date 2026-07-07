"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRecommend = exports.scheduledSpotifySync = exports.syncSpotifyListening = exports.spotifyOAuth = exports.stravaOAuth = exports.helloWorld = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const zod_1 = require("zod");
const zod_2 = require("openai/helpers/zod");
const cors_1 = __importDefault(require("cors"));
dotenv.config();
/**
 * Local Testing Instructions for Strava Webhook
 *
 * 1. Build the TypeScript code:
 *    npm run build
 *
 * 2. Start Firebase emulators:
 *    firebase emulators:start --only functions,firestore
 *
 * 3. Start ngrok tunnel:
 *    npx ngrok http 5001
 *
 * 4. Authorize Strava OAuth:
 *    Visit: https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=YOUR_NGROK_URL/amrita-website/us-central1/stravaOAuth&scope=activity:read_all&approval_prompt=force
 *
 * 5. Manage webhook subscription:
 *    - Check existing subscriptions:
 *      curl -G https://www.strava.com/api/v3/push_subscriptions \
 *        -d client_id=CLIENT_ID \
 *        -d client_secret=CLIENT_SECRET | jq

 *    - Delete a subscription:
 *      curl -X DELETE "https://www.strava.com/api/v3/push_subscriptions/SUBSCRIPTION_ID?client_id=CLIENT_ID&client_secret=CLIENT_SECRET"
 *    - Create a new subscription:
 *      curl -X POST https://www.strava.com/api/v3/push_subscriptions \
 *        -F client_id=CLIENT_ID \
 *        -F client_secret=CLIENT_SECRET \
 *        -F callback_url=YOUR_NGROK_URL/amrita-website/us-central1/helloWorld \
 *        -F verify_token=myVerifyToken

 */
admin.initializeApp();
const db = admin.firestore();
const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const SPOTIFY_CLIENT_ID = (_a = process.env.SPOTIFY_CLIENT_ID) !== null && _a !== void 0 ? _a : "";
const SPOTIFY_CLIENT_SECRET = (_b = process.env.SPOTIFY_CLIENT_SECRET) !== null && _b !== void 0 ? _b : "";
const SPOTIFY_REDIRECT_URI = (_c = process.env.SPOTIFY_REDIRECT_URI) !== null && _c !== void 0 ? _c : "https://us-central1-amrita-website.cloudfunctions.net/spotifyOAuth";
const BookRecommendation = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    description: zod_1.z.string(),
    link: zod_1.z.string(),
});
const recommendations = zod_1.z.object({
    books: zod_1.z.array(BookRecommendation),
});
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
const corsHandler = (0, cors_1.default)({
    origin: [
        "https://amrita-website--pr25-av-book-recommender-amnp7sy9.web.app",
        "http://localhost:3000",
        "https://bookrecommend-77xzict4da-uc.a.run.app",
        "https://amritav.com",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
});
/* =====================================================================
 * 1.  /helloWorld  – Strava Webhook (handshake + activity POST)
 * =================================================================== */
exports.helloWorld = (0, https_1.onRequest)(async (req, res) => {
    logger.info("Webhook hit", { method: req.method, path: req.path });
    /* ---- 1-a  Verification handshake (GET) ------------------------- */
    if (req.method === "GET") {
        if (req.query["hub.verify_token"] !== "myVerifyToken") {
            res.status(403).send("Bad verify token");
            return;
        }
        res
            .status(200)
            .json({ "hub.challenge": req.query["hub.challenge"] });
        return;
    }
    /* ---- 1-b  Activity POST ---------------------------------------- */
    if (req.method === "POST") {
        res.status(200).send("hooray"); // ACK first so Strava stops retrying
        try {
            const { object_id } = req.body;
            logger.info(`Created activity with id ${object_id}`);
            const token = await getFreshAccessToken();
            const { data: act } = await axios_1.default.get(`https://www.strava.com/api/v3/activities/${object_id}`, { headers: { Authorization: `Bearer ${token}` } });
            logger.info(`Fetched activity ${object_id}: ${act.name} ${act.sport_type}`);
            try {
                // Write to Firestore:
                await db.collection("activities").doc(object_id.toString()).set({
                    name: act.name,
                    sportType: act.sport_type,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
            catch (e) {
                logger.error("Failed to write activity data", e);
            }
            logger.info(`Saved activity ${object_id} (${act.sport_type})`);
        }
        catch (e) {
            logger.warn(`Failed to fetch full activity`, e);
        }
        return;
    }
    res.status(405).send("Method not allowed");
});
/* =====================================================================
 * 2.  /stravaOAuth  – handles the browser redirect & stores tokens
 * =================================================================== */
exports.stravaOAuth = (0, https_1.onRequest)(async (req, res) => {
    var _a;
    const authCode = req.query.code;
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
        const { data } = await axios_1.default.post("https://www.strava.com/api/v3/oauth/token", body.toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        // Save the trio {access_token, refresh_token, expires_at} in Firestore
        try {
            await db.doc("config/stravaTokens").set(data); // ok so I learned that in order for this to work, the database on firestore needs to be named (default)
            logger.info("Stored new Strava tokens", { athlete: (_a = data.athlete) === null || _a === void 0 ? void 0 : _a.id });
        }
        catch (e) {
            logger.error("Failed to store tokens", e);
            res.status(500).send("Failed to store tokens");
            return;
        }
        res
            .status(200)
            .send("✅ Strava authorised! You can close this tab and test the webhook.");
    }
    catch (err) {
        logger.error("OAuth exchange failed", err);
        res.status(500).send("OAuth token exchange failed – see logs.");
    }
});
/**
 *
 * @returns Promise
 */
async function getFreshAccessToken() {
    const snap = await db.doc("config/stravaTokens").get();
    const tokens = snap.data();
    if (!tokens)
        throw new Error("Strava tokens not found; run OAuth first");
    if (Date.now() / 1000 < tokens.expires_at - 60)
        return tokens.access_token;
    const { data } = await axios_1.default.post("https://www.strava.com/api/v3/oauth/token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: tokens.refresh_token,
    });
    await snap.ref.set(data);
    return data.access_token;
}
async function getFreshSpotifyAccessToken() {
    const snap = await db.doc("config/spotifyTokens").get();
    const tokens = snap.data();
    if (!tokens) {
        throw new Error("Spotify tokens not found; run spotifyOAuth first");
    }
    if (Date.now() / 1000 < tokens.expires_at - 60) {
        return tokens.access_token;
    }
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokens.refresh_token,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
    });
    const { data } = await axios_1.default.post("https://accounts.spotify.com/api/token", body.toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    const refreshed = {
        access_token: data.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
    };
    await snap.ref.set(refreshed);
    return refreshed.access_token;
}
async function syncRecentlyPlayedToFirestore() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const token = await getFreshSpotifyAccessToken();
    const { data } = await axios_1.default.get("https://api.spotify.com/v1/me/player/recently-played", {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 50 },
    });
    const batch = db.batch();
    let written = 0;
    for (const item of (_a = data.items) !== null && _a !== void 0 ? _a : []) {
        const track = item.track;
        if (!(track === null || track === void 0 ? void 0 : track.id) || !item.played_at)
            continue;
        const playedAt = new Date(item.played_at);
        const docId = `${track.id}_${playedAt.getTime()}`;
        const docRef = db.collection("recentTracks").doc(docId);
        batch.set(docRef, {
            trackId: track.id,
            trackName: track.name,
            artistName: (_c = (_b = track.artists) === null || _b === void 0 ? void 0 : _b.map((a) => a.name).join(", ")) !== null && _c !== void 0 ? _c : "",
            albumName: (_e = (_d = track.album) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : "",
            albumImageUrl: (_j = (_h = (_g = (_f = track.album) === null || _f === void 0 ? void 0 : _f.images) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.url) !== null && _j !== void 0 ? _j : "",
            spotifyUrl: (_l = (_k = track.external_urls) === null || _k === void 0 ? void 0 : _k.spotify) !== null && _l !== void 0 ? _l : "",
            playedAt: admin.firestore.Timestamp.fromDate(playedAt),
        }, { merge: true });
        written++;
    }
    if (written > 0) {
        await batch.commit();
    }
    return written;
}
exports.spotifyOAuth = (0, https_1.onRequest)(async (req, res) => {
    const authCode = req.query.code;
    if (!authCode) {
        res.status(400).send("Missing ?code param");
        return;
    }
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        res.status(500).send("Spotify client credentials are not configured");
        return;
    }
    try {
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            code: authCode,
            redirect_uri: SPOTIFY_REDIRECT_URI,
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET,
        });
        const { data } = await axios_1.default.post("https://accounts.spotify.com/api/token", body.toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const tokens = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
        };
        await db.doc("config/spotifyTokens").set(tokens);
        logger.info("Stored new Spotify tokens");
        try {
            const count = await syncRecentlyPlayedToFirestore();
            res
                .status(200)
                .send(`✅ Spotify authorised! Synced ${count} recent tracks. You can close this tab.`);
        }
        catch (syncError) {
            logger.error("Initial Spotify sync failed", syncError);
            res
                .status(200)
                .send("✅ Spotify authorised, but the initial sync failed. Try syncSpotifyListening manually.");
        }
    }
    catch (err) {
        logger.error("Spotify OAuth exchange failed", err);
        res.status(500).send("Spotify OAuth token exchange failed – see logs.");
    }
});
exports.syncSpotifyListening = (0, https_1.onRequest)(async (req, res) => {
    if (req.method !== "POST" && req.method !== "GET") {
        res.status(405).send("Method not allowed");
        return;
    }
    try {
        const count = await syncRecentlyPlayedToFirestore();
        res.status(200).json({ synced: count });
    }
    catch (err) {
        logger.error("Spotify sync failed", err);
        res.status(500).json({ error: "Spotify sync failed – see logs." });
    }
});
exports.scheduledSpotifySync = (0, scheduler_1.onSchedule)("every 30 minutes", async () => {
    try {
        const count = await syncRecentlyPlayedToFirestore();
        logger.info(`Spotify scheduled sync wrote ${count} tracks`);
    }
    catch (err) {
        logger.warn("Spotify scheduled sync skipped or failed", err);
    }
});
exports.bookRecommend = (0, https_1.onRequest)(async (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method === "OPTIONS") {
            res.status(204).send("");
            return;
        }
        if (req.method !== "POST") {
            res.status(405).send("Method Not Allowed");
            return;
        }
        try {
            const { books } = req.body;
            if (!Array.isArray(books) || books.length === 0) {
                res.status(400).json({ error: "Please provide an array of books" });
                return;
            }
            const response = await openai.responses.parse({
                model: "gpt-4o-2024-08-06",
                input: [
                    {
                        role: "system",
                        content: "You are a helpful assistant tasked with giving 3 book recommendations based on the books the user gives. Make sure the book recommendations include the title, author, a brief description, and the link to the Goodreads page.",
                    },
                    {
                        role: "user",
                        content: `Recommend me a book similar to the following books: ${books.join(", ")}.`,
                    },
                ],
                text: {
                    format: (0, zod_2.zodTextFormat)(recommendations, "book_recommendations"),
                },
            });
            if (response.error != null) {
                throw new Error(`Error: ${response.status}`);
            }
            res.status(200).json(response.output_parsed);
        }
        catch (error) {
            logger.error("Book recommendation failed", error);
            res
                .status(500)
                .json({ error: "Failed to generate book recommendations" });
        }
    });
});
//# sourceMappingURL=index.js.map