

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
