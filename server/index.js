


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

// // Import routers
// import householdRouter from "./householdData.js";
// import contactUsRouter from "./contactUs.js";
// import authRouter from "./Authentication.js";
// import businessRouter from "./businessData.js";
// import adminRouter from "./adminData.js";

// // Import passport config (must be after passport import and before use)
// import "./passport.js";

// dotenv.config();

// const app = express();
// const MemoryStore = memorystore(session);
// const port = process.env.PORT || 3001;

// // Determine environment
// const isProduction = process.env.NODE_ENV === "production";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ===== PostgreSQL DB Connection =====
// // Use connection string for simplicity and SSL in production
// const db = new pg.Client({
//   connectionString: process.env.PG_CONNECTION_STRING,
//   ...(isProduction && {
//     ssl: { rejectUnauthorized: false },
//   }),
// });

// // db
// //   .connect()
// //   .then(() => console.log("✅ Connected to PostgreSQL database"))
// //   .catch((err) => console.error("❌ Database connection error:", err));

// // ===== Middleware =====
// app.use(
//   cors({
//     origin: isProduction
//       ? "https://prithwe-carbon-footprint-tracker.onrender.com"
//       : "http://localhost:5173", // frontend dev port
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
//     store: new MemoryStore({
//       checkPeriod: 86400000, // prune expired entries every 24h
//     }),
//     cookie: {
//       secure: isProduction,
//       httpOnly: true,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 86400000,
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // ===== Routes =====
// app.use("/api/household", householdRouter);
// app.use("/api/contact", contactUsRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/business", businessRouter);
// app.use("/api/admin", adminRouter);

// // ===== Auth status and user type routes =====
// app.get("/api/auth/login/status", (req, res) => {
//   if (req.user) {
//     req.session.userId = req.user.id;
//     return res.status(200).json(req.user);
//   } else {
//     return res.sendStatus(401);
//   }
// });

// app.get("/api/auth/user-type", (req, res) => {
//   if (req.user) {
//     req.session.userType = req.user.type;
//     return res.status(200).json({ type: req.user.type });
//   } else {
//     return res.sendStatus(401);
//   }
// });

// // ===== Serve React frontend in production =====
// if (isProduction) {
//   const clientDist = path.join(__dirname, "../client/dist");
//   app.use(express.static(clientDist));
//   app.get("*", (_, res) => res.sendFile(path.join(clientDist, "index.html")));
// } else {
//   app.get("/", (_, res) => res.send("App is under development."));
// }

// // ===== Keep Render alive (ping) =====
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
// }, 800000);

// // ===== Start Server =====
// app.listen(port, () => {
//   console.log(`🚀 Server listening on port ${port}`);
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

// Import routers
import householdRouter from "./householdData.js";
import contactUsRouter from "./contactUs.js";
import authRoutes from "./Authentication.js"; // ✅ Corrected route path & name
import businessRouter from "./businessData.js";
import adminRouter from "./adminData.js";

// Import passport config
import "./passport.js";

dotenv.config();

const app = express();
const MemoryStore = memorystore(session);
const port = process.env.PORT || 3001;

// Determine environment
const isProduction = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== PostgreSQL DB Connection =====
const db = new pg.Client({
  connectionString: process.env.PG_CONNECTION_STRING,
  ...(isProduction && {
    ssl: { rejectUnauthorized: false },
  }),
});

db
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// ===== Middleware =====
app.use(
  cors({
    origin: isProduction
      ? "https://prithwe-carbon-footprint-tracker.onrender.com"
      : "http://localhost:5173",
    credentials: true,
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
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 86400000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===== Routes =====
app.use("/api/household", householdRouter);
app.use("/api/contact", contactUsRouter);
app.use("/api/auth", authRoutes); // ✅ This line is now fixed and clear
app.use("/api/business", businessRouter);
app.use("/api/admin", adminRouter);

// ===== Auth status and user type =====
app.get("/api/auth/login/status", (req, res) => {
  if (req.user) {
    req.session.userId = req.user.id;
    return res.status(200).json(req.user);
  } else {
    return res.sendStatus(401);
  }
});

app.get("/api/auth/user-type", (req, res) => {
  if (req.user) {
    req.session.userType = req.user.type;
    return res.status(200).json({ type: req.user.type });
  } else {
    return res.sendStatus(401);
  }
});

// ===== Serve frontend in production =====
if (isProduction) {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  app.get("/", (_, res) => res.send("App is under development."));
}

// ===== Keep Render alive =====
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
}, 800000);

// ===== Start server =====
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});

// Optional if needed elsewhere
export { db };
