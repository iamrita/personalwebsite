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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRecommend = exports.stravaOAuth = exports.helloWorld = void 0;
const https_1 = require("firebase-functions/v2/https");
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
const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
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