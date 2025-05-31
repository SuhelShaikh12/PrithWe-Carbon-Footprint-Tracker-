


// // import express from 'express';
// // import bcrypt from 'bcryptjs';
// // import { Pool } from 'pg';
// // import { body, validationResult } from 'express-validator';
// // import expressSession from 'express-session';
// // import connectPgSimple from 'connect-pg-simple';

// // const router = express.Router();

// // // PostgreSQL Connection Pool
// // const pool = new Pool({
// //   user: 'prithvi_db_user',
// //   host: 'dpg-d0heie3e5dus73av1ds0-a.oregon-postgres.render.com',
// //   database: 'prithvi_db',
// //   password: 'HR2tJlCVvoQrDT4jAQbB0dBj7gERACdd',
// //   port: 5432,
// //   ssl: { rejectUnauthorized: false }
// // });

// // // Initialize session store
// // const PgSession = connectPgSimple(expressSession);
// // const sessionStore = new PgSession({
// //   pool, // Pass the PostgreSQL pool to the session store
// //   tableName: 'session',
// // });

// // // Setup session middleware
// // router.use(
// //   expressSession({
// //     store: sessionStore,
// //     secret: 'yourSecretKey',
// //     resave: false,
// //     saveUninitialized: true,
// //     cookie: {
// //       secure: false, // true if HTTPS
// //       maxAge: 60 * 60 * 1000, // 1 hour
// //     },
// //   })
// // );

// // // Register Route
// // router.post('/register', [
// //   body('email').isEmail().withMessage('Please provide a valid email address'),
// //   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// //   body('name').notEmpty().withMessage('Name is required'),
// //   body('type').notEmpty().withMessage('Please select a user type'),
// // ], async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return res.status(400).json({ errors: errors.array() });
// //   }

// //   const { name, email, password, type } = req.body;

// //   try {
// //     // Check if user exists
// //     const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
// //     if (existingUser.rows.length > 0) {
// //       return res.status(400).json({ message: 'User already exists' });
// //     }

// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // Insert new user
// //     const newUser = await pool.query(
// //       'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
// //       [name, email, hashedPassword, type]
// //     );

// //     const user = newUser.rows[0];

// //     // Store in session
// //     req.session.user = {
// //       id: user.id,
// //       name: user.name,
// //       email: user.email,
// //       type: user.type,
// //     };

// //     res.status(201).json({
// //       message: 'User registered successfully',
// //       user: { id: user.id, name: user.name, email: user.email, type: user.type }
// //     });

// //   } catch (err) {
// //     console.error('Error registering user:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });


// // // Fixed Login Route
// // router.post('/login', [
// //   body('email').isEmail().withMessage('Please provide a valid email address'),
// //   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// //   body('type').notEmpty().withMessage('Please select a user type'),  // Keep required, or make optional if you want
// // ], async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return res.status(400).json({ errors: errors.array() });
// //   }

// //   const { email, password, type } = req.body;

// //   try {
// //     // Fetch user by email only
// //     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

// //     if (result.rows.length === 0) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }

// //     const user = result.rows[0];

// //     // Check password
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: 'Invalid credentials' });
// //     }

// //     // Check user type matches exactly (case sensitive)
// //     if (user.type !== type) {
// //       return res.status(400).json({ message: 'Invalid user type' });
// //     }

// //     // Store user info in session
// //     req.session.user = {
// //       id: user.id,
// //       name: user.name,
// //       email: user.email,
// //       type: user.type,
// //     };

// //     res.json({
// //       message: 'Login successful',
// //       user: { id: user.id, name: user.name, email: user.email, type: user.type },
// //     });

// //   } catch (err) {
// //     console.error('Error logging in:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // Logout Route
// // router.post('/logout', (req, res) => {
// //   req.session.destroy((err) => {
// //     if (err) {
// //       return res.status(500).json({ message: 'Failed to logout' });
// //     }
// //     res.json({ message: 'Logged out successfully' });
// //   });
// // });

// // export default router;



// import express from 'express';
// import bcrypt from 'bcryptjs'; // your original bcryptjs for hashing
// import { Pool } from 'pg';
// import { body, validationResult } from 'express-validator';
// import session from 'express-session';
// import connectPgSimple from 'connect-pg-simple';
// import passport from 'passport';

// const router = express.Router();

// // PostgreSQL Connection Pool
// const pool = new Pool({
//   user: 'prithvi_db_user',
//   host: 'dpg-d0heie3e5dus73av1ds0-a.oregon-postgres.render.com',
//   database: 'prithvi_db',
//   password: 'HR2tJlCVvoQrDT4jAQbB0dBj7gERACdd',
//   port: 5432,
//   ssl: { rejectUnauthorized: false },
// });

// // Initialize session store
// const PgSession = connectPgSimple(session);
// const sessionStore = new PgSession({
//   pool,
//   tableName: 'session',
// });

// // Setup session middleware on the router (if your main app doesn't do it already)
// router.use(
//   session({
//     store: sessionStore,
//     secret: process.env.SESSION_SECRET || 'yourSecretKey',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 1000, // 1 hour
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       httpOnly: true,
//     },
//   })
// );

// // Initialize Passport middleware here if not initialized in main app
// router.use(passport.initialize());
// router.use(passport.session());

// // -------- Register Route --------
// router.post('/register', [
//   body('email').isEmail().withMessage('Please provide a valid email address'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('name').notEmpty().withMessage('Name is required'),
//   body('type').notEmpty().withMessage('Please select a user type'),
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { name, email, password, type } = req.body;

//   try {
//     const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await pool.query(
//       'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING id, name, email, type',
//       [name, email, hashedPassword, type]
//     );

//     const user = newUser.rows[0];

//     // Store user info in session after registration
//     req.session.user = user;

//     res.status(201).json({
//       message: 'User registered successfully',
//       user,
//     });

//   } catch (err) {
//     console.error('Error registering user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // -------- Login Route --------
// router.post('/login', [
//   body('email').isEmail().withMessage('Please provide a valid email address'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('type').notEmpty().withMessage('Please select a user type'),
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { email, password, type } = req.body;

//   try {
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

//     const user = result.rows[0];

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     if (user.type !== type) return res.status(400).json({ message: 'Invalid user type' });

//     req.session.user = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       type: user.type,
//     };

//     res.json({
//       message: 'Login successful',
//       user: req.session.user,
//     });

//   } catch (err) {
//     console.error('Error logging in:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // -------- Logout Route --------
// router.post('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       return res.status(500).json({ message: 'Failed to logout' });
//     }
//     res.clearCookie('connect.sid'); // Clear cookie on logout
//     res.json({ message: 'Logged out successfully' });
//   });
// });

// // -------- OTP Verification Route --------
// // This is dummy, replace with your real OTP logic as needed
// router.post('/verify-otp', (req, res) => {
//   const { email, otp } = req.body;

//   // TODO: Replace with real OTP verification (DB/Redis)
//   if (otp === '123456') {
//     return res.json({ message: 'OTP verified successfully' });
//   } else {
//     return res.status(400).json({ message: 'Invalid OTP' });
//   }
// });

// // -------- Google OAuth Routes --------
// router.get('/auth/google', (req, res, next) => {
//   const { userType } = req.query;
//   if (!userType || (userType !== 'Household' && userType !== 'Business')) {
//     return res.status(400).send('UserType query param required (Household or Business)');
//   }
//   req.session.userType = userType; // Store userType in session for use in callback
//   next();
// }, passport.authenticate('google', {
//   scope: ['profile', 'email'],
//   prompt: 'select_account',
// }));

// router.get('/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login-failed', // Update with your frontend route if needed
//     session: true,
//   }),
//   (req, res) => {
//     // Successful authentication: redirect or send JSON
//     res.redirect('/dashboard'); // Or send JSON if you want API response here
//   }
// );

// export default router;




import express from 'express';
import bcrypt from 'bcryptjs';
import passport from './passport.js';
import { body, validationResult } from 'express-validator';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

// Register (email/password)
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
    body('type').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, type } = req.body;

    try {
      const exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (exists.rows.length > 0)
        return res.status(400).json({ message: 'User already exists' });

      const hashed = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashed, type]
      );

      req.session.user = {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        type: newUser.rows[0].type,
      };

      res.status(201).json({ message: 'Registered', user: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login (email/password)
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('type').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password, type } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0)
        return res.status(400).json({ message: 'Invalid credentials' });

      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match || user.type !== type)
        return res.status(400).json({ message: 'Invalid credentials or user type' });

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      };

      res.json({ message: 'Logged in', user: req.session.user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
});

// Google OAuth start
router.get(
  '/auth/google',
  (req, res, next) => {
    const { userType } = req.query;
    if (!userType || !['Household', 'Business'].includes(userType)) {
      return res.status(400).send('UserType query param required: Household or Business');
    }
    req.session.userType = userType;
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

// Google OAuth callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed',
    session: true,
  }),
  (req, res) => {
    req.session.user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      type: req.user.type,
    };
    res.redirect('/dashboard');
  }
);

export default router;
