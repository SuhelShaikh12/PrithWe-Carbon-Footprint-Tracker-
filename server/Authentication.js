


// // backend/routes/authRoutes.js (or wherever your auth routes live)
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import passport from './passport.js'; // adjust path as needed
// import { body, validationResult } from 'express-validator';
// import { query } from './db.js'; // Use shared query function

// const router = express.Router();

// // Register route
// router.post(
//   '/register',
//   [
//     body('email').isEmail(),
//     body('password').isLength({ min: 6 }),
//     body('name').notEmpty(),
//     body('type').notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, type } = req.body;

//     try {
//       const exists = await query('SELECT * FROM users WHERE email = $1', [email]);
//       if (exists.rows.length > 0)
//         return res.status(400).json({ message: 'User already exists' });

//       const hashed = await bcrypt.hash(password, 10);
//       const newUser = await query(
//         'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
//         [name, email, hashed, type]
//       );

//       req.session.user = {
//         id: newUser.rows[0].id,
//         name: newUser.rows[0].name,
//         email: newUser.rows[0].email,
//         type: newUser.rows[0].type,
//       };

//       res.status(201).json({ message: 'Registered', user: req.session.user });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// );

// // Login route
// router.post(
//   '/login',
//   [
//     body('email').isEmail(),
//     body('password').isLength({ min: 6 }),
//     body('type').notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, password, type } = req.body;

//     try {
//       const result = await query('SELECT * FROM users WHERE email = $1', [email]);
//       if (result.rows.length === 0)
//         return res.status(400).json({ message: 'Invalid credentials' });

//       const user = result.rows[0];
//       const match = await bcrypt.compare(password, user.password);

//       if (!match || user.type !== type)
//         return res.status(400).json({ message: 'Invalid credentials or user type' });

//       req.session.user = {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         type: user.type,
//       };

//       res.json({ message: 'Logged in', user: req.session.user });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// );

// // Logout route
// router.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({ message: 'Logout failed' });
//     res.json({ message: 'Logged out' });
//   });
// });

// // Google OAuth start
// router.get(
//   '/auth/google',
//   (req, res, next) => {
//     const { userType } = req.query;
//     if (!userType || !['Household', 'Business'].includes(userType)) {
//       return res.status(400).send('UserType query param required: Household or Business');
//     }
//     req.session.userType = userType;
//     next();
//   },
//   passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
// );

// // Google OAuth callback
// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login-failed',
//     session: true,
//   }),
//   (req, res) => {
//     req.session.user = {
//       id: req.user.id,
//       name: req.user.name,
//       email: req.user.email,
//       type: req.user.type,
//     };
//     res.redirect('/dashboard');
//   }
// );

// export default router;



import dotenv from 'dotenv';
dotenv.config(); // This must be before using process.env

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import { query } from "./db.js";
// your database query function

const router = express.Router();

// Configure nodemailer transporter with your email credentials (use env vars)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register route with OTP email verification
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
      // Check if user exists
      const exists = await query("SELECT * FROM users WHERE email = $1", [email]);
      if (exists.rows.length > 0)
        return res.status(400).json({ message: "User already exists" });

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Insert user (initially unverified)
      const newUser = await query(
        "INSERT INTO users (name, email, password, type, verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, hashed, type, false]
      );

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

      // Save OTP in email_verifications table
      await query(
        "INSERT INTO email_verifications (user_id, otp, expires_at) VALUES ($1, $2, $3)",
        [newUser.rows[0].id, otp, expiresAt]
      );

      // Send OTP email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email - OTP code",
        text: `Hello ${name},\n\nYour verification code is: ${otp}\nIt will expire in 10 minutes.\n\nThank you!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending OTP email:", error);
          // Optional: handle error or still allow registration with unverified user
        } else {
          console.log("OTP email sent:", info.response);
        }
      });

      // Respond with success and userId for OTP verification step
      res.status(201).json({
        message: "Registered successfully! Please verify your email with the OTP sent.",
        userId: newUser.rows[0].id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// OTP verification route
router.post(
  "/verify-otp",
  [
    body("userId").isInt(),
    body("otp").isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { userId, otp } = req.body;

    try {
      // Find matching OTP record (not verified yet)
      const record = await query(
        "SELECT * FROM email_verifications WHERE user_id = $1 AND otp = $2 AND verified = false",
        [userId, otp]
      );

      if (record.rows.length === 0)
        return res.status(400).json({ message: "Invalid OTP or already verified" });

      const verification = record.rows[0];

      // Check expiry
      if (new Date() > new Date(verification.expires_at)) {
        return res.status(400).json({ message: "OTP expired" });
      }

      // Mark OTP as verified
      await query("UPDATE email_verifications SET verified = true WHERE id = $1", [verification.id]);

      // Mark user as verified
      await query("UPDATE users SET verified = true WHERE id = $1", [userId]);

      res.json({ message: "Email verified successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login route (only allow if verified)
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").exists(),
    body("type").notEmpty(),
  ],
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

      // Create JWT token (adjust secret & expiry as needed)
      const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Send cookie or token back (example with cookie)
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      res.json({ message: "Login successful!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
