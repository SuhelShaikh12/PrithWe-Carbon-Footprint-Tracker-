

// // Authentication.js (Express routes for register, login, OTP)

// // Authentication.js
// // Authentication.js
// import express from 'express';
// import bcrypt from 'bcrypt';
// import passport from 'passport';
// import { pool } from './db.js'; // named import
// import { generateOTP, sendOTPEmail } from './SentOTP.js';

// const router = express.Router();

// // ... rest of your code unchanged ...

// router.post('/register', async (req, res) => {
//   const { name, email, password, type } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'Missing fields' });
//   }
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     await pool.query(
//       'INSERT INTO users (name, email, password, type, email_verified) VALUES ($1,$2,$3,$4,false)',
//       [name, email, hashed, type]
//     );
//     return res.status(201).json({ message: 'Registered, please verify your email.' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Registration error' });
//   }
// });

// // POST /auth/send-otp
// router.post('/send-otp', async (req, res) => {
//   const { email } = req.body;
//   try {
//     // Make email case-insensitive
//     const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
//     if (!rows.length) return res.status(404).json({ message: 'No such user' });

//     const user = rows[0];
//     if (user.email_verified) return res.status(400).json({ message: 'Email already verified' });

//     const otp = generateOTP();
//     const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

//     await pool.query(
//       'UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3',
//       [otp, expires, user.email] // use exact case email from DB
//     );

//     await sendOTPEmail(user.email, otp);
//     return res.json({ message: 'OTP sent' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Error sending OTP' });
//   }
// });


// // POST /auth/verify-otp
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
//     console.error(err);
//     return res.status(500).json({ message: 'Verification failed' });
//   }
// });

// // POST /auth/login
// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/dashboard',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

// export default router;


import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { pool } from './db.js'; // named import
import { generateOTP, sendOTPEmail } from './SentOTP.js';

const router = express.Router();

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

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const lowerEmail = email.toLowerCase();

    const { rows } = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = $1',
      [lowerEmail]
    );

    if (!rows.length) return res.status(404).json({ message: 'No such user' });

    const user = rows[0];

    if (user.email_verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET otp=$1, otp_timestamp=$2 WHERE email=$3',
      [otp, expires, user.email] // use original case email from DB
    );

    await sendOTPEmail(user.email, otp);
    return res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
});


// POST /api/auth/verify-otp
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

// POST /api/auth/login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

export default router;
