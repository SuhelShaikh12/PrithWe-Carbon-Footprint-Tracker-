

import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import cors from 'cors';
import env from 'dotenv';
import cookieParser from 'cookie-parser';

env.config();

const app = express();
const port = 3001;
const saltRounds = 10;

// PostgreSQL client setup
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// Enable CORS for frontend (adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));

app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,  // IMPORTANT: false to avoid empty sessions
  cookie: { secure: false }, // false for local dev (no HTTPS)
}));

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for login
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return done(null, false, { message: 'User not found' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return done(null, false, { message: 'Invalid password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return done(null, false);
    }
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

// Login endpoint
// app.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) return next(err);
//     if (!user) return res.status(401).send(info.message || 'Invalid credentials');

//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       req.session.userId = user.id;
//       res.status(200).send('Login successful');
//     });
//   })(req, res, next);
// });




app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error("Auth error:", err);
      return next(err);
    }
    if (!user) {
      console.warn("Authentication failed:", info.message);
      return res.status(401).send(info.message || 'Invalid credentials');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }

      req.session.userId = user.id;
      res.status(200).send({ message: "Login successful", sessionKey: req.sessionID });
    });
  })(req, res, next);
});

// Check login status endpoint
app.get('/login/status', (req, res) => {
  if (req.user) {
    req.session.userId = req.user.id;
    res.status(200).json(req.user);
  } else {
    res.sendStatus(401);
  }
});

// Get user type endpoint
app.get('/user-type', (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.session.userType = req.user.type;
  res.status(200).json({ type: req.user.type });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
