



// import express from "express";
// import path from "path";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import passport from "passport";
// import memorystore from "memorystore";
// import pg from "pg";
// import axios from "axios";
// import { fileURLToPath } from "url";

// // Routers
// import householdRouter from "./householdData.js";
// import contactUsRouter from "./contactUs.js";
// import authRoutes from "./Authentication.js"; // Only registration + login
// import businessRouter from "./businessData.js";
// import adminRouter from "./adminData.js";

// // Passport strategy
// import "./passport.js";

// dotenv.config();

// const app = express();
// const MemoryStore = memorystore(session);
// const port = process.env.PORT || 3001;
// const isProduction = process.env.NODE_ENV === "production";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // === PostgreSQL Setup ===
// const db = new pg.Client({
//   connectionString: process.env.PG_CONNECTION_STRING,
//   ...(isProduction && { ssl: { rejectUnauthorized: false } }),
// });

// db.connect()
//   .then(() => console.log("✅ Connected to PostgreSQL"))
//   .catch((err) => console.error("❌ DB connection error:", err));

// // === Middleware ===
// app.use(
//   cors({
//     origin: isProduction
//       ? "https://prithwe-carbon-footprint-tracker.onrender.com"
//       : "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "default_secret",
//     resave: false,
//     saveUninitialized: false,
//     store: new MemoryStore({ checkPeriod: 86400000 }), // 1 day
//     cookie: {
//       secure: isProduction,
//       httpOnly: true,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 86400000, // 1 day
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // === API Routes ===
// app.use("/api/household", householdRouter);
// app.use("/api/contact", contactUsRouter);
// app.use("/api/auth", authRoutes); // Handles register/login only
// app.use("/api/business", businessRouter);
// app.use("/api/admin", adminRouter);

// // === Auth Session Check ===
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

// // === Frontend Serving (Production) ===
// if (isProduction) {
//   const clientDist = path.join(__dirname, "../client/dist");
//   app.use(express.static(clientDist));
//   app.get("*", (_, res) => res.sendFile(path.join(clientDist, "index.html")));
// } else {
//   app.get("/", (_, res) => res.send("App is in development mode."));
// }

// // === Keep Alive Ping (Render.com) ===
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
// }, 800000); // 13.3 minutes

// // === Start Server ===
// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });

// export { db };



import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import memorystore from "memorystore";
import pg from "pg";
import axios from "axios";
import { fileURLToPath } from "url";

// Routers
import householdRouter from "./householdData.js";
import contactUsRouter from "./contactUs.js";
import authRoutes from "./Authentication.js"; // your auth routes
import businessRouter from "./businessData.js";
import adminRouter from "./adminData.js";

// Passport strategy
import "./passport.js";

dotenv.config();

const app = express();
const MemoryStore = memorystore(session);
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === PostgreSQL Setup ===
const db = new pg.Client({
  connectionString: process.env.PG_CONNECTION_STRING,
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error:", err));

// === Middleware ===
app.use(
  cors({
    origin: isProduction
      ? "https://prithwe-carbon-footprint-tracker.onrender.com"
      : "http://localhost:5173",
    credentials: true, // important for cookies
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }), // 1 day
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 86400000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// === API Routes ===
app.use("/api/household", householdRouter);
app.use("/api/contact", contactUsRouter);
app.use("/api/auth", authRoutes); // <-- auth routes prefix '/api/auth'
app.use("/api/business", businessRouter);
app.use("/api/admin", adminRouter);

// === Auth Session Check ===
app.get("/api/auth/login/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  }
  return res.sendStatus(401);
});

app.get("/api/auth/user-type", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ type: req.user.type });
  }
  return res.sendStatus(401);
});

// === Frontend Serving (Production) ===
if (isProduction) {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  app.get("/", (_, res) => res.send("App is in development mode."));
}

// === Keep Alive Ping (Render.com) ===
const pingURL = isProduction
  ? "https://prithwe-carbon-footprint-tracker.onrender.com/"
  : `http://localhost:${port}/`;

setInterval(() => {
  axios
    .get(pingURL)
    .then((res) =>
      console.log(`🌐 Pinged at ${new Date().toISOString()} — Status: ${res.status}`)
    )
    .catch((err) => console.error("⚠️ Ping error:", err.message));
}, 800000); // every 13.3 minutes

// === Start Server ===
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

export { db };
