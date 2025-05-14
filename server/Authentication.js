


// import express from 'express';
// import bcrypt from 'bcrypt';
// import passport from 'passport';
// import { check, validationResult } from 'express-validator';
// import { query } from './db.js';  // Your DB connection
// import { generateSixDigitOTP, sendOTP } from './SendOTP.js';  // OTP helper functions
// import memorystore from 'memorystore';
// import session from 'express-session';
// import cookieParser from 'cookie-parser';
// import env from 'dotenv';

// const MemoryStore = memorystore(session);
// const router = express.Router();
// const saltRounds = 10;

// env.config();

// // Initialize session store and middleware
// router.use(cookieParser());
// router.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false, maxAge: 86400000 },
//     store: new MemoryStore({ checkPeriod: 86400000 }),
//   })
// );
// router.use(passport.initialize());
// router.use(passport.session());

// // ===== POST Register =====
// router.post('/register', [
//   check('email').isEmail().withMessage('Invalid email'),
//   check('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password, name, type } = req.body;
//   try {
//     const checkResult = await query('SELECT * FROM users WHERE email = $1', [email]);
//     if (checkResult.rows.length > 0) {
//       return res.status(400).send('User already exists');
//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const result = await query(
//       'INSERT INTO users (email, name, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
//       [email, name, hashedPassword, type || 'user']
//     );

//     return res.status(201).json({ user: result.rows[0] });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // ===== POST Login =====
// router.post('/login', (req, res, next) => {
//   if (req.body.email === process.env.ADMIN_MAIL && req.body.password === process.env.ADMIN_PASS) {
//     return res.status(200).json({ type: "admin" });
//   }

//   passport.authenticate('local', (err, user, info) => {
//     if (err) { return next(err); }
//     if (!user) { return res.status(401).send('Invalid credentials'); }
//     if (!user.isverified) { return res.status(402).send("Not Verified"); }

//     req.logIn(user, (err) => {
//       if (err) { return next(err); }
//       req.session.userId = user.id;
//       return res.status(200).json({ type: "user" });
//     });
//   })(req, res, next);
// });

// // ===== Send OTP =====
// router.post('/sendOTP', async (req, res) => {
//   try {
//     const email = req.body.email;
//     const otp = generateSixDigitOTP();
//     await sendOTP(email, otp, "Verify OTP");
//     const result = await query('UPDATE users SET otp = $1 WHERE email = $2 RETURNING *', [otp, email]);

//     if (result.rowCount === 0) {
//       return res.status(404).json({ success: false, message: "Email not found" });
//     }

//     return res.status(200).json({ success: true, message: "OTP Sent" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// });

// // ===== Verify OTP =====
// router.post('/verifyOTP', async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const result = await query('SELECT otp FROM users WHERE email = $1', [email]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Email not found" });
//     }

//     const storedOtp = result.rows[0].otp;
//     if (storedOtp === otp) {
//       await query('UPDATE users SET isverified = true WHERE email = $1', [email]);
//       return res.status(200).json({ success: true, message: "OTP Verified" });
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Failed to verify OTP" });
//   }
// });

// // ===== Reset Password =====
// router.post('/resetPassword', async (req, res) => {
//   const { email, newPassword } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
//     const result = await query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [hashedPassword, email]);
//     return res.status(201).json({ user: result.rows[0] });
//   } catch (err) {
//     return res.status(500).json({ message: 'Error resetting password' });
//   }
// });

// // ===== Get User Status =====
// router.get('/login/status', (req, res) => {
//   return req.user ? res.send(req.user) : res.sendStatus(401);
// });

// // ===== Logout =====
// router.post('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.sendStatus(500);
//     }
//     return res.sendStatus(200);
//   });
// });

// // ===== Serialize and Deserialize User =====
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const result = await query('SELECT * FROM users WHERE id = $1', [id]);
//     const user = result.rows[0];
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// export default router;


// import express from 'express';
// import bcrypt from 'bcryptjs';
// import { Pool } from 'pg';
// import { body, validationResult } from 'express-validator';

// const router = express.Router();

// // PostgreSQL Connection Pool
// const pool = new Pool({
//   user: 'prithvi_db_user',
//   host: 'dpg-d0heie3e5dus73av1ds0-a.oregon-postgres.render.com',
//   database: 'prithvi_db',
//   password: 'HR2tJlCVvoQrDT4jAQbB0dBj7gERACdd',
//   port: 5432,
//   ssl: { rejectUnauthorized: false }
// });

// // Register Route
// router.post('/register', [
//   body('email').isEmail().withMessage('Please provide a valid email address'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('name').not().isEmpty().withMessage('Name is required'),
//   body('type').not().isEmpty().withMessage('Please select a user type')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password, type } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert new user into database
//     const newUser = await pool.query(
//       'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
//       [name, email, hashedPassword, type]
//     );

//     const user = newUser.rows[0];
//     res.status(201).json({
//       message: 'User registered successfully',
//       user: { id: user.id, name: user.name, email: user.email, type: user.type }
//     });
//   } catch (err) {
//     console.error('Error registering user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;

// import express from 'express';
// import bcrypt from 'bcryptjs';
// import { Pool } from 'pg';
// import { body, validationResult } from 'express-validator';
// import jwt from 'jsonwebtoken';  // For generating JWT tokens

// const router = express.Router();

// // PostgreSQL Connection Pool
// const pool = new Pool({
//   user: 'prithvi_db_user',
//   host: 'dpg-d0heie3e5dus73av1ds0-a.oregon-postgres.render.com',
//   database: 'prithvi_db',
//   password: 'HR2tJlCVvoQrDT4jAQbB0dBj7gERACdd',
//   port: 5432,
//   ssl: { rejectUnauthorized: false }
// });

// // Register Route
// router.post('/register', [
//   body('email').isEmail().withMessage('Please provide a valid email address'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('name').not().isEmpty().withMessage('Name is required'),
//   body('type').not().isEmpty().withMessage('Please select a user type')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password, type } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert new user into database
//     const newUser = await pool.query(
//       'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
//       [name, email, hashedPassword, type]
//     );

//     const user = newUser.rows[0];
//     res.status(201).json({
//       message: 'User registered successfully',
//       user: { id: user.id, name: user.name, email: user.email, type: user.type }
//     });
//   } catch (err) {
//     console.error('Error registering user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login Route
// router.post('/login', [
//   body('email').isEmail().withMessage('Please provide a valid email address'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('type').not().isEmpty().withMessage('Please select a user type')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password, type } = req.body;

//   try {
//     // Check if user exists
//     const result = await pool.query('SELECT * FROM users WHERE email = $1 AND type = $2', [email, type]);
//     if (result.rows.length === 0) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const user = result.rows[0];

//     // Compare the hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Create a JWT token
//     const token = jwt.sign({ userId: user.id, type: user.type }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({
//       message: 'Login successful',
//       token,
//       user: { id: user.id, name: user.name, email: user.email, type: user.type }
//     });
//   } catch (err) {
//     console.error('Error logging in:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;

import express from 'express';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { body, validationResult } from 'express-validator';
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const router = express.Router();

// PostgreSQL Connection Pool
const pool = new Pool({
  user: 'prithvi_db_user',
  host: 'dpg-d0heie3e5dus73av1ds0-a.oregon-postgres.render.com',
  database: 'prithvi_db',
  password: 'HR2tJlCVvoQrDT4jAQbB0dBj7gERACdd',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Initialize session store
const PgSession = connectPgSimple(expressSession);
const sessionStore = new PgSession({
  pool, // Pass the PostgreSQL pool to the session store
  tableName: 'session', // Optional: Name of the session table in the database
});

// Setup session middleware
router.use(
  expressSession({
    store: sessionStore,
    secret: 'yourSecretKey', // Use a strong secret for production
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// Register Route
router.post('/register', [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').not().isEmpty().withMessage('Name is required'),
  body('type').not().isEmpty().withMessage('Please select a user type')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, type } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, type]
    );

    const user = newUser.rows[0];
    
    // Store user information in the session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email, type: user.type }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('type').not().isEmpty().withMessage('Please select a user type')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, type } = req.body;

  try {
    // Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND type = $2', [email, type]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Store user information in the session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    };

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, type: user.type },
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
