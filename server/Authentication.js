


// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { body, validationResult } from "express-validator";
// import { query } from "./db.js";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();

// // ✅ Register Route (No OTP sent here)
// router.post(
//   "/register",
//   [
//     body("email").isEmail(),
//     body("password").isLength({ min: 6 }),
//     body("name").notEmpty(),
//     body("type").notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, type } = req.body;

//     try {
//       const exists = await query("SELECT * FROM users WHERE email = $1", [email]);
//       if (exists.rows.length > 0)
//         return res.status(400).json({ message: "User already exists" });

//       const hashed = await bcrypt.hash(password, 10);
//       const newUser = await query(
//         "INSERT INTO users (name, email, password, type, verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//         [name, email, hashed, type, false]
//       );

//       res.status(201).json({
//         message: "Registered successfully. Please verify your email.",
//         userId: newUser.rows[0].id,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ Send OTP
// import { sendOTP, generateSixDigitOTP } from "./SendOTP.js";

// router.post("/send-otp", async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email required" });

//   const otp = generateSixDigitOTP();
//   try {
//     await sendOTP(email, otp, "Verify your email - OTP code");
//     res.json({ message: "OTP sent to email" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Verify OTP
// router.post(
//   "/verify-otp",
//   [body("email").isEmail(), body("otp").isLength({ min: 6, max: 6 })],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, otp } = req.body;
//     const normalizedEmail = email.trim().toLowerCase();

//     try {
//       const userRes = await query("SELECT * FROM users WHERE LOWER(email) = $1", [normalizedEmail]);
//       if (userRes.rows.length === 0)
//         return res.status(404).json({ message: "User not found" });

//       const user = userRes.rows[0];
//       if (user.verified) return res.status(400).json({ message: "Already verified" });

//       const now = Date.now();
//       if (user.otp !== otp || !user.otp_timestamp || now - user.otp_timestamp > 10 * 60 * 1000) {
//         return res.status(400).json({ message: "Invalid or expired OTP" });
//       }

//       await query("UPDATE users SET verified = true, otp = NULL, otp_timestamp = NULL WHERE email = $1", [email]);
//       res.json({ message: "Email verified successfully!" });
//     } catch (err) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ Login
// router.post(
//   "/login",
//   [body("email").isEmail(), body("password").exists(), body("type").notEmpty()],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, password, type } = req.body;

//     try {
//       const userResult = await query("SELECT * FROM users WHERE email = $1 AND type = $2", [email, type]);
//       if (userResult.rows.length === 0)
//         return res.status(400).json({ message: "Invalid credentials" });

//       const user = userResult.rows[0];

//       if (!user.verified)
//         return res.status(403).json({ message: "Please verify your email before logging in" });

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch)
//         return res.status(400).json({ message: "Invalid credentials" });

//       const token = jwt.sign(
//         { id: user.id, email: user.email, type: user.type },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
//       res.json({ message: "Login successful!" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// export default router;


import express from "express";
import bcrypt from "bcrypt";
import db from "./db.js"; // ✅ fixed: use default import
import { sendOTP } from "./SendOTP.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    if (!name || !email || !password || !type) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await db.query("SELECT * FROM users WHERE LOWER(email) = $1", [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (name, email, password, type, verified) VALUES ($1, $2, $3, $4, false) RETURNING id",
      [name, email.toLowerCase(), hashedPassword, type]
    );

    res.status(201).json({
      message: "Registered successfully. Please verify your email.",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Send OTP route
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const userResult = await db.query("SELECT id FROM users WHERE LOWER(email) = $1", [email.toLowerCase()]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const userId = userResult.rows[0].id;
    await sendOTP(email); // will also update OTP + timestamp in DB

    res.json({ message: "OTP sent to email", userId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Missing email or OTP" });

    const result = await db.query(
      "SELECT otp, otp_timestamp, id FROM users WHERE LOWER(email) = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const { otp: savedOtp, otp_timestamp, id: userId } = result.rows[0];
    const now = Date.now();

    if (!savedOtp || !otp_timestamp) {
      return res.status(400).json({ message: "No OTP requested for this email" });
    }

    if (now - otp_timestamp > 10 * 60 * 1000) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (savedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await db.query(
      "UPDATE users SET verified = true, otp = NULL, otp_timestamp = NULL WHERE id = $1",
      [userId]
    );

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});

export default router;
