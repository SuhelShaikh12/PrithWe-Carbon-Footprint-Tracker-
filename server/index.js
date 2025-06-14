
// import express from "express";
// import path from "path";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import passport from "passport";
// import pg from "pg";
// import PgSession from "connect-pg-simple";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import axios from "axios";
// import { fileURLToPath } from "url";

// // Routers
// import householdRouter from "./householdData.js";
// import contactUsRouter from "./contactUs.js";
// import authRoutes from "./Authentication.js"; // your auth routes
// import businessRouter from "./businessData.js";
// import adminRouter from "./adminData.js";

// // Passport strategy
// import "./passport.js";

// dotenv.config();
// app.use('/api/auth', authRoutes);
// const app = express();

// const isProduction = process.env.NODE_ENV === "production";
// const port = process.env.PORT || 3001;

// // Setup PostgreSQL Pool (you can also import from your db.js if preferred)
// import { pool } from "./db.js";

// // Initialize PgSession for storing sessions in PostgreSQL
// const PgSessionStore = PgSession(session);

// // CORS config
// app.use(
//   cors({
//     origin: isProduction
//       ? "https://prithwe-carbon-footprint-tracker.onrender.com"
//       : "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(helmet()); // Basic security headers

// // Rate limiting - basic limiter for all requests (adjust as needed)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 mins
//   max: 100, // max requests per IP
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use(limiter);

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Ensure SESSION_SECRET is set in production
// const sessionSecret = process.env.SESSION_SECRET;
// if (isProduction && !sessionSecret) {
//   console.error("❌ SESSION_SECRET environment variable is required in production");
//   process.exit(1);
// }

// app.use(
//   session({
//     store: new PgSessionStore({
//       pool: pool, // Use pg pool
//       tableName: "session",
//       // You can add other options here
//     }),
//     secret: sessionSecret || "default_secret_dev", // only fallback for dev
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: isProduction,
//       httpOnly: true,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // === API Routes ===
// app.use("/api/household", householdRouter);
// app.use("/api/contact", contactUsRouter);
// app.use("/api/auth", authRoutes);
// app.use("/api/business", businessRouter);
// app.use("/api/admin", adminRouter);

// // Auth session status
// app.get("/api/auth/login/status", (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.status(200).json(req.user);
//   }
//   return res.sendStatus(401);
// });

// app.get("/api/auth/user-type", (req, res) => {
//   if (req.isAuthenticated()) {
//     return res.status(200).json({ type: req.user.type });
//   }
//   return res.sendStatus(401);
// });

// // Frontend serving in production
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// if (isProduction) {
//   const clientDist = path.join(__dirname, "../client/dist");
//   app.use(express.static(clientDist));
//   app.get("*", (_, res) => res.sendFile(path.join(clientDist, "index.html")));
// } else {
//   app.get("/", (_, res) => res.send("App is in development mode."));
// }

// // Keep alive ping for Render.com
// const pingURL = isProduction
//   ? "https://prithwe-carbon-footprint-tracker.onrender.com/"
//   : `http://localhost:${port}/`;

// setInterval(() => {
//   axios
//     .get(pingURL)
//     .then((res) =>
//       console.log(`🌐 Pinged at ${new Date().toISOString()} — Status: ${res.status}`)
//     )
//     .catch((err) => console.error("⚠️ Ping error:", err.message));
// }, 800000); // every 13.3 minutes

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("❌ Unhandled error:", err);
//   res.status(500).json({ message: "Internal server error" });
// });

// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });


import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import axios from "axios";
import { fileURLToPath } from "url";

import authRoutes from "./Authentication.js";
import { pool } from "./db.js";
import PgSession from "connect-pg-simple";
import dotenv from 'dotenv';
dotenv.config();

console.log('[DEBUG] Current DB Host:', process.env.PG_HOST);
console.log('[DEBUG] Full Connection String:', process.env.PG_CONNECTION_STRING);
// Setup

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet());
app.use(cors({
  origin: isProduction
    ? "https://prithwe-carbon-footprint-tracker.onrender.com"
    : "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  store: new (PgSession(session))({ pool, tableName: "session" }),
  secret: process.env.SESSION_SECRET || "default_dev_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
import "./passport.js";
app.use("/api/auth", authRoutes);

app.get("/api/auth/login/status", (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  res.sendStatus(401);
});

app.get("/api/auth/user-type", (req, res) => {
  if (req.isAuthenticated()) return res.json({ type: req.user.type });
  res.sendStatus(401);
});

// Serve frontend in production
if (isProduction) {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.get("/", (_, res) => res.send("Server running"));

// Auto-ping for Render
setInterval(() => {
  axios.get(isProduction ? "https://prithwe-carbon-footprint-tracker.onrender.com/" : `http://localhost:${port}/`)
    .then(r => console.log("Pinged", r.status))
    .catch(e => console.error("Ping error", e.message));
}, 800000);

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
