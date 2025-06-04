

// import express from "express";
// import bcrypt from "bcrypt";
// import passport from "passport";
// import { pool } from "./db.js";
// import { generateOTP, sendOTPEmail } from "./SentOTP.js";

// const router = express.Router();
// app.use('/api/auth', authRoutes);
// // POST /api/auth/register
// router.post("/register", async (req, res) => {
//   const { name, email, password, type } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "Missing fields" });
//   }
//   try {
//     // Check if user already exists
//     const existing = await pool.query(
//       "SELECT * FROM users WHERE email=$1",
//       [email.toLowerCase()]
//     );
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     // Save user with email_verified = false
//     await pool.query(
//       "INSERT INTO users (name, email, password, type, email_verified) VALUES ($1, $2, $3, $4, false)",
//       [name, email.toLowerCase(), hashed, type]
//     );

//     // Generate OTP and expiry (15 mins)
//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000);

//     await pool.query(
//       "UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3",
//       [otp, expires, email.toLowerCase()]
//     );

//     await sendOTPEmail(email, otp);

//     return res
//       .status(201)
//       .json({ message: "Registered successfully. OTP sent to email." });
//   } catch (err) {
//     console.error("Register error:", err);
//     return res.status(500).json({ message: "Registration error" });
//   }
// });

// // POST /api/auth/send-otp (resend OTP)
// router.post("/send-otp", async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required." });

//   try {
//     const { rows } = await pool.query(
//       "SELECT * FROM users WHERE LOWER(email) = $1",
//       [email.toLowerCase()]
//     );
//     if (!rows.length) return res.status(404).json({ message: "User not found" });

//     const user = rows[0];
//     if (user.email_verified) {
//       return res.status(400).json({ message: "Email already verified" });
//     }

//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000);

//     await pool.query(
//       "UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3",
//       [otp, expires, user.email]
//     );

//     await sendOTPEmail(user.email, otp);
//     return res.json({ message: "OTP resent to email" });
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     return res.status(500).json({ message: "Error sending OTP" });
//   }
// });

// // POST /api/auth/verify-otp
// router.post("/verify-otp", async (req, res, next) => {
//   const { email, otp } = req.body;
//   if (!email || !otp)
//     return res.status(400).json({ message: "Email and OTP required" });

//   try {
//     const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
//       email.toLowerCase(),
//     ]);
//     if (!rows.length) return res.status(404).json({ message: "User not found" });

//     const user = rows[0];
//     const now = new Date();

//     if (
//       !user.otp ||
//       !user.otp_timestamp ||
//       user.otp !== otp ||
//       now > user.otp_timestamp
//     ) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     await pool.query(
//       "UPDATE users SET email_verified=true, otp=NULL, otp_timestamp=NULL WHERE email=$1",
//       [email.toLowerCase()]
//     );

//     // Automatically login user after verification
//     req.login(user, (err) => {
//       if (err) return next(err);
//       return res.json({ message: "Email verified and logged in" });
//     });
//   } catch (err) {
//     console.error("OTP verification error:", err);
//     return res.status(500).json({ message: "Verification failed" });
//   }
// });

// // POST /api/auth/login (passport with verification check)
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", async (err, user, info) => {
//     if (err) {
//       console.error("Login error:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     if (!user) {
//       return res.status(401).json({ message: info?.message || "Invalid credentials" });
//     }

//     if (!user.email_verified) {
//       return res
//         .status(403)
//         .json({ message: "Please verify your email before logging in" });
//     }

//     req.login(user, (err) => {
//       if (err) {
//         console.error("Login error:", err);
//         return res.status(500).json({ message: "Login failed" });
//       }
//       return res.json({ message: "Login successful" });
//     });
//   })(req, res, next);
// });

// export default router;


import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { pool } from "./db.js";
import { generateOTP, sendOTPEmail } from "./SentOTP.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, type } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email.toLowerCase()]);
    if (existing.rows.length) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, type, email_verified) VALUES ($1, $2, $3, $4, false)",
      [name, email.toLowerCase(), hashed, type]
    );

    const otp = generateOTP();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query("UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3", [otp, expires, email.toLowerCase()]);
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "Registered. OTP sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [email.toLowerCase()]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    const user = rows[0];

    if (user.email_verified) return res.status(400).json({ message: "Already verified" });

    const otp = generateOTP();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query("UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3", [otp, expires, email.toLowerCase()]);
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP resent" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email.toLowerCase()]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    if (!user.otp || !user.otp_timestamp || user.otp !== otp || new Date() > user.otp_timestamp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    await pool.query("UPDATE users SET email_verified=true, otp=NULL, otp_timestamp=NULL WHERE email=$1", [email.toLowerCase()]);

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Email verified and logged in" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification error" });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: "Internal error" });
    if (!user) return res.status(401).json({ message: info?.message || "Login failed" });

    if (!user.email_verified) return res.status(403).json({ message: "Verify email first" });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login error" });
      res.json({ message: "Login successful" });
    });
  })(req, res, next);
});

export default router;
