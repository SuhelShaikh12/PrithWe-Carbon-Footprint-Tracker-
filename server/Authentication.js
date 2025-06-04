






// import express from "express";
// import bcrypt from "bcrypt";
// import passport from "passport";
// import { db } from "./index.js"; // your DB client

// const router = express.Router();

// // Registration route
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, type } = req.body;

//     if (!name || !email || !password || !type) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     // Check if the email already exists
//     const userExists = await db.query(
//       "SELECT 1 FROM users WHERE LOWER(email) = $1",
//       [normalizedEmail]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ message: "Email already registered." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       "INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4)",
//       [name, normalizedEmail, hashedPassword, type]
//     );

//     res.status(201).json({ message: "Registration successful! Please log in." });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Server error during registration." });
//   }
// });

// // Login route
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);

//     if (!user) {
//       return res.status(401).json({ message: info.message || "Invalid credentials." });
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       return res.status(200).json({
//         message: "Login successful!",
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           type: user.type,
//         },
//       });
//     });
//   })(req, res, next);
// });

// export default router;


// Authentication.js (Express routes for register, login, OTP)

// Authentication.js
import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import pool from './db.js'; // default export
import { generateOTP, sendOTPEmail } from './SentOTP.js';

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, type, email_verified) VALUES ($1,$2,$3,$4,false)',
      [name, email, hashed, type]
    );
    return res.status(201).json({ message: 'Registered, please verify your email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Registration error' });
  }
});

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!rows.length) return res.status(404).json({ message: 'No such user' });

    const user = rows[0];
    if (user.email_verified) return res.status(400).json({ message: 'Email already verified' });

    const otp = generateOTP();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await pool.query(
      'UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3',
      [otp, expires, email]
    );

    await sendOTPEmail(email, otp);
    return res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    const now = new Date();

    if (!user.otp || !user.otp_timestamp || user.otp !== otp || now > user.otp_timestamp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await pool.query(
      'UPDATE users SET email_verified=true, otp=NULL, otp_timestamp=NULL WHERE email=$1',
      [email]
    );

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Email verified and logged in' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Verification failed' });
  }
});

// POST /auth/login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

export default router;


