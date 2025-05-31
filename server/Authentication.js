


//  // This must be before using process.env

// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { body, validationResult } from "express-validator";

// import { query } from "./db.js";
// // your database query function

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");


// const router = express.Router();

// // Configure nodemailer transporter with your email credentials (use env vars)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Register route with OTP email verification
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
//       // Check if user exists
//       const exists = await query("SELECT * FROM users WHERE email = $1", [email]);
//       if (exists.rows.length > 0)
//         return res.status(400).json({ message: "User already exists" });

//       // Hash password
//       const hashed = await bcrypt.hash(password, 10);

//       // Insert user (initially unverified)
//       const newUser = await query(
//         "INSERT INTO users (name, email, password, type, verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//         [name, email, hashed, type, false]
//       );

//       // Generate 6-digit OTP
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

//       // Save OTP in email_verifications table
//       await query(
//         "INSERT INTO email_verifications (user_id, otp, expires_at) VALUES ($1, $2, $3)",
//         [newUser.rows[0].id, otp, expiresAt]
//       );

//       // Send OTP email
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "Verify your email - OTP code",
//         text: `Hello ${name},\n\nYour verification code is: ${otp}\nIt will expire in 10 minutes.\n\nThank you!`,
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error sending OTP email:", error);
//           // Optional: handle error or still allow registration with unverified user
//         } else {
//           console.log("OTP email sent:", info.response);
//         }
//       });

//       // Respond with success and userId for OTP verification step
//       res.status(201).json({
//         message: "Registered successfully! Please verify your email with the OTP sent.",
//         userId: newUser.rows[0].id,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // OTP verification route
// router.post(
//   "/verify-otp",
//   [
//     body("userId").isInt(),
//     body("otp").isLength({ min: 6, max: 6 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { userId, otp } = req.body;

//     try {
//       // Find matching OTP record (not verified yet)
//       const record = await query(
//         "SELECT * FROM email_verifications WHERE user_id = $1 AND otp = $2 AND verified = false",
//         [userId, otp]
//       );

//       if (record.rows.length === 0)
//         return res.status(400).json({ message: "Invalid OTP or already verified" });

//       const verification = record.rows[0];

//       // Check expiry
//       if (new Date() > new Date(verification.expires_at)) {
//         return res.status(400).json({ message: "OTP expired" });
//       }

//       // Mark OTP as verified
//       await query("UPDATE email_verifications SET verified = true WHERE id = $1", [verification.id]);

//       // Mark user as verified
//       await query("UPDATE users SET verified = true WHERE id = $1", [userId]);

//       res.json({ message: "Email verified successfully!" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // Login route (only allow if verified)
// router.post(
//   "/login",
//   [
//     body("email").isEmail(),
//     body("password").exists(),
//     body("type").notEmpty(),
//   ],
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

//       // Create JWT token (adjust secret & expiry as needed)
//       const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, process.env.JWT_SECRET, {
//         expiresIn: "1d",
//       });

//       // Send cookie or token back (example with cookie)
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
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

import { query } from "./db.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register route (no OTP sent here)
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty(),
    body("type").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, type } = req.body;

    try {
      const exists = await query("SELECT * FROM users WHERE email = $1", [email]);
      if (exists.rows.length > 0)
        return res.status(400).json({ message: "User already exists" });

      const hashed = await bcrypt.hash(password, 10);

      const newUser = await query(
        "INSERT INTO users (name, email, password, type, verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, hashed, type, false]
      );

      res.status(201).json({
        message: "Registered successfully. Please verify your email.",
        userId: newUser.rows[0].id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Send OTP route
router.post("/send-otp", [body("email").isEmail()], async (req, res) => {
  const { email } = req.body;

  try {
    const userRes = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = userRes.rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await query(
      "INSERT INTO email_verifications (user_id, otp, expires_at, verified) VALUES ($1, $2, $3, $4)",
      [user.id, otp, expiresAt, false]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email - OTP code",
      text: `Hello ${user.name},\n\nYour verification code is: ${otp}\nIt will expire in 10 minutes.\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
      } else {
        console.log("OTP email sent:", info.response);
      }
    });

    res.json({ message: "OTP sent to email", userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP route
router.post(
  "/verify-otp",
  [body("userId").isInt(), body("otp").isLength({ min: 6, max: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { userId, otp } = req.body;

    try {
      const record = await query(
        "SELECT * FROM email_verifications WHERE user_id = $1 AND otp = $2 AND verified = false",
        [userId, otp]
      );

      if (record.rows.length === 0)
        return res.status(400).json({ message: "Invalid OTP or already verified" });

      const verification = record.rows[0];

      if (new Date() > new Date(verification.expires_at)) {
        return res.status(400).json({ message: "OTP expired" });
      }

      await query("UPDATE email_verifications SET verified = true WHERE id = $1", [verification.id]);
      await query("UPDATE users SET verified = true WHERE id = $1", [userId]);

      res.json({ message: "Email verified successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login route
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists(), body("type").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password, type } = req.body;

    try {
      const userResult = await query("SELECT * FROM users WHERE email = $1 AND type = $2", [email, type]);
      if (userResult.rows.length === 0)
        return res.status(400).json({ message: "Invalid credentials" });

      const user = userResult.rows[0];

      if (!user.verified)
        return res.status(403).json({ message: "Please verify your email before logging in" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, email: user.email, type: user.type },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      res.json({ message: "Login successful!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
