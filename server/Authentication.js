


// import express from 'express';
// import bcrypt from 'bcrypt';
// import passport from 'passport';
// import { pool } from './db.js';
// import { generateOTP, sendOTPEmail } from './SentOTP.js';

// const router = express.Router();

// // ✅ POST /api/auth/register
// router.post('/register', async (req, res) => {
//   const { name, email, password, type } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'Missing fields' });
//   }
//   try {
//     // Check if user already exists
//     const existing = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     // Save user with email_verified=false
//     await pool.query(
//       'INSERT INTO users (name, email, password, type, email_verified) VALUES ($1, $2, $3, $4, false)',
//       [name, email, hashed, type]
//     );

//     // Generate OTP and expiry
//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now

//     await pool.query(
//       'UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3',
//       [otp, expires, email]
//     );

//     await sendOTPEmail(email, otp);

//     return res.status(201).json({ message: 'Registered. OTP sent to email.' });
//   } catch (err) {
//     console.error('Register error:', err);
//     return res.status(500).json({ message: 'Registration error' });
//   }
// });

// // ✅ POST /api/auth/send-otp (for resend)
// router.post('/send-otp', async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required." });

//   try {
//     const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [email.toLowerCase()]);
//     if (!rows.length) return res.status(404).json({ message: 'User not found' });

//     const user = rows[0];
//     if (user.email_verified) {
//       return res.status(400).json({ message: 'Email already verified' });
//     }

//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000);

//     await pool.query(
//       'UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3',
//       [otp, expires, user.email]
//     );

//     await sendOTPEmail(user.email, otp);
//     return res.json({ message: 'OTP resent to email' });
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     return res.status(500).json({ message: 'Error sending OTP' });
//   }
// });

// // ✅ POST /api/auth/verify-otp
// router.post('/verify-otp', async (req, res, next) => {
//   const { email, otp } = req.body;
//   try {
//     const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
//     if (!rows.length) return res.status(404).json({ message: 'User not found' });

//     const user = rows[0];
//     const now = new Date();

//     if (!user.otp || !user.otp_timestamp || user.otp !== otp || now > user.otp_timestamp) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }

//     await pool.query(
//       'UPDATE users SET email_verified=true, otp=NULL, otp_timestamp=NULL WHERE email=$1',
//       [email]
//     );

//     req.login(user, (err) => {
//       if (err) return next(err);
//       return res.json({ message: 'Email verified and logged in' });
//     });
//   } catch (err) {
//     console.error('OTP verification error:', err);
//     return res.status(500).json({ message: 'Verification failed' });
//   }
// });

// // ✅ POST /api/auth/login (checks if email is verified)
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', async (err, user, info) => {
//     if (err) return next(err);
//     if (!user) return res.status(401).json({ message: 'Invalid email or password' });

//     if (!user.email_verified) {
//       return res.status(403).json({ message: 'Please verify your email before logging in.' });
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       return res.json({ message: 'Login successful' });
//     });
//   })(req, res, next);
// });

// export default router;


// import express from 'express';
// import bcrypt from 'bcrypt';
// import passport from 'passport';
// import { pool } from './db.js';
// import { generateOTP, sendOTPEmail } from './SentOTP.js';

// const router = express.Router();

// // POST /api/auth/register
// router.post('/register', async (req, res) => {
//   const { name, email, password, type } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'Missing fields' });
//   }
//   try {
//     // Check if user already exists
//     const existing = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     // Save user with email_verified = false
//     await pool.query(
//       'INSERT INTO users (name, email, password, type, email_verified) VALUES ($1, $2, $3, $4, false)',
//       [name, email.toLowerCase(), hashed, type]
//     );

//     // Generate OTP and expiry (15 mins)
//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000);

//     await pool.query(
//       'UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3',
//       [otp, expires, email.toLowerCase()]
//     );

//     await sendOTPEmail(email, otp);

//     return res.status(201).json({ message: 'Registered successfully. OTP sent to email.' });
//   } catch (err) {
//     console.error('Register error:', err);
//     return res.status(500).json({ message: 'Registration error' });
//   }
// });

// // POST /api/auth/send-otp (resend OTP)
// router.post('/send-otp', async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required." });

//   try {
//     const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [email.toLowerCase()]);
//     if (!rows.length) return res.status(404).json({ message: 'User not found' });

//     const user = rows[0];
//     if (user.email_verified) {
//       return res.status(400).json({ message: 'Email already verified' });
//     }

//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000);

//     await pool.query(
//       'UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3',
//       [otp, expires, user.email]
//     );

//     await sendOTPEmail(user.email, otp);
//     return res.json({ message: 'OTP resent to email' });
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     return res.status(500).json({ message: 'Error sending OTP' });
//   }
// });

// // POST /api/auth/verify-otp
// router.post('/verify-otp', async (req, res, next) => {
//   const { email, otp } = req.body;
//   if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

//   try {
//     const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
//     if (!rows.length) return res.status(404).json({ message: 'User not found' });

//     const user = rows[0];
//     const now = new Date();

//     if (!user.otp || !user.otp_timestamp || user.otp !== otp || now > user.otp_timestamp) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }

//     await pool.query(
//       'UPDATE users SET email_verified=true, otp=NULL, otp_timestamp=NULL WHERE email=$1',
//       [email.toLowerCase()]
//     );

//     // Automatically login user after verification
//     req.login(user, (err) => {
//       if (err) return next(err);
//       return res.json({ message: 'Email verified and logged in' });
//     });
//   } catch (err) {
//     console.error('OTP verification error:', err);
//     return res.status(500).json({ message: 'Verification failed' });
//   }
// });

// // POST /api/auth/login (passport with verification check)
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', async (err, user, info) => {
//     if (err) {
//       console.error('Login error:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!user) {
//       return res.status(401).json({ message: info?.message || 'Invalid credentials' });
//     }

//     if (!user.email_verified) {
//       return res.status(403).json({ message: 'Please verify your email before logging in' });
//     }

//     req.login(user, (err) => {
//       if (err) {
//         console.error('Login error:', err);
//         return res.status(500).json({ message: 'Login failed' });
//       }
//       return res.json({ message: 'Login successful' });
//     });
//   })(req, res, next);
// });

// export default router;


import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import pg from "pg";
import PgSession from "connect-pg-simple";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3001;

// Setup PostgreSQL Pool (you can also import from your db.js if preferred)
import { pool } from "./db.js";

// Initialize PgSession for storing sessions in PostgreSQL
const PgSessionStore = PgSession(session);

// CORS config
app.use(
  cors({
    origin: isProduction
      ? "https://prithwe-carbon-footprint-tracker.onrender.com"
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet()); // Basic security headers

// Rate limiting - basic limiter for all requests (adjust as needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max requests per IP
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure SESSION_SECRET is set in production
const sessionSecret = process.env.SESSION_SECRET;
if (isProduction && !sessionSecret) {
  console.error("❌ SESSION_SECRET environment variable is required in production");
  process.exit(1);
}

app.use(
  session({
    store: new PgSessionStore({
      pool: pool, // Use pg pool
      tableName: "session",
      // You can add other options here
    }),
    secret: sessionSecret || "default_secret_dev", // only fallback for dev
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// === API Routes ===
app.use("/api/household", householdRouter);
app.use("/api/contact", contactUsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRouter);
app.use("/api/admin", adminRouter);

// Auth session status
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

// Frontend serving in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (isProduction) {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  app.get("/", (_, res) => res.send("App is in development mode."));
}

// Keep alive ping for Render.com
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
