


// import express from 'express';
// import path from 'path';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import passport from 'passport';
// import memorystore from 'memorystore';
// import pg from 'pg';
// import bcrypt from 'bcrypt';
// import axios from 'axios';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { fileURLToPath } from 'url';

// import householdRouter from './householdData.js';
// import contactUsRouter from './contactUs.js';
// import authRouter from './Authentication.js';
// import businessRouter from './businessData.js';
// import adminRouter from './adminData.js';

// dotenv.config();
// const app = express();
// const MemoryStore = memorystore(session);
// const port = process.env.PORT || 3001;
// const isProduction = process.env.NODE_ENV === 'production';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ===== PostgreSQL DB Connection =====
// const db = new pg.Client({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
//   ...(isProduction && {
//     ssl: { require: true, rejectUnauthorized: false },
//   }),
// });

// db.connect()
//   .then(() => console.log('✅ Connected to PostgreSQL database'))
//   .catch((err) => console.error('❌ Database connection error:', err));

// // ===== Middleware =====
// app.use(cors({
//   origin: isProduction ? 'https://prithwe-carbon-footprint-tracker.onrender.com' : 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Session Configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'default_secret',
//   resave: false,
//   saveUninitialized: false,
//   store: new MemoryStore({ checkPeriod: 86400000 }),
//   cookie: {
//     secure: isProduction,  // Secure cookies in production (HTTPS)
//     httpOnly: true,
//     sameSite: isProduction ? 'none' : 'lax',  // Handle cookies in production
//     maxAge: 86400000  // 1 day
//   }
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // ===== Passport Local Strategy =====
// passport.use(
//   new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
//     try {
//       const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
//       if (result.rows.length === 0) return done(null, false, { message: 'No user found' });
//       const user = result.rows[0];
//       const isMatch = await bcrypt.compare(password, user.password);
//       return isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password' });
//     } catch (err) {
//       console.error(err);
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   try {
//     const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
//     done(null, result.rows[0]);
//   } catch (err) {
//     done(err);
//   }
// });

// // ===== Google Strategy =====
// async function findOrCreateUser(googleId, profile) {
//   const existing = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
//   if (existing.rows.length > 0) return existing.rows[0];

//   const hashed = await bcrypt.hash('defaultpassword', 10);
//   const newUser = await db.query(
//     'INSERT INTO users (google_id, email, name, password, type, isVerified) VALUES ($1, $2, $3, $4, $5, true) RETURNING *',
//     [googleId, profile.emails[0].value, profile.displayName, hashed, 'user']
//   );
//   return newUser.rows[0];
// }

// passport.use(new GoogleStrategy({
//   clientID: process.env.OAUTH_CLIENT_ID,
//   clientSecret: process.env.OAUTH_SECRET,
//   callbackURL: isProduction
//     ? 'https://prithwe-carbon-footprint-tracker.onrender.com/auth/google/prithwe'
//     : 'http://localhost:3001/auth/google/prithwe',
//   userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
// }, async (accessToken, refreshToken, profile, cb) => {
//   try {
//     const user = await findOrCreateUser(profile.id, profile);
//     return cb(null, user);
//   } catch (err) {
//     return cb(err);
//   }
// }));

// // ===== Google Routes =====
// app.get('/auth/google', (req, res, next) => {
//   res.cookie('userType', req.query.userType, {
//     httpOnly: true,
//     sameSite: isProduction ? 'none' : 'lax',
//     secure: isProduction,
//   });
//   passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
// });

// app.get('/auth/google/prithwe', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
//   await db.query('UPDATE users SET type = $1 WHERE email = $2', [req.cookies.userType, req.user.email]);
//   res.clearCookie('userType');
//   res.redirect(isProduction ? 'https://prithwe-carbon-footprint-tracker.onrender.com' : 'http://localhost:5173');
// });

// // ===== API Routes =====
// app.use('/api/household', householdRouter);
// app.use('/api/contact', contactUsRouter);
// app.use('/api/auth', authRouter);
// app.use('/api/business', businessRouter);
// app.use('/api/admin', adminRouter);

// // ===== Serve React Frontend in Production =====
// if (isProduction) {
//   const clientDist = path.join(__dirname, '../client/dist');
//   app.use(express.static(clientDist));
//   app.get('*', (_, res) => res.sendFile(path.join(clientDist, 'index.html')));
// } else {
//   app.get('/', (_, res) => res.send('App is under development.'));
// }

// // ===== Keep Render Alive =====
// const pingURL = 'https://prithwe-carbon-footprint-tracker.onrender.com/';
// setInterval(() => {
//   axios.get(pingURL)
//     .then(res => console.log(`🌐 Pinged at ${new Date().toISOString()} — Status: ${res.status}`))
//     .catch(err => console.error('⚠️ Ping error:', err.message));
// }, 800000);

// // ===== Start Server =====
// app.listen(port, () => {
//   console.log(`🚀 Server listening on port ${port}`);
// });



// import express from 'express';
// import path from 'path';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import passport from 'passport';
// import memorystore from 'memorystore';
// import pg from 'pg';
// import bcrypt from 'bcrypt';
// import axios from 'axios';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { fileURLToPath } from 'url';

// import householdRouter from './householdData.js';
// import contactUsRouter from './contactUs.js';
// import authRouter from './Authentication.js';
// import businessRouter from './businessData.js';
// import adminRouter from './adminData.js';

// dotenv.config();
// const app = express();
// const MemoryStore = memorystore(session);
// const port = process.env.PORT || 3001;
// const isProduction = process.env.NODE_ENV === 'production';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ===== PostgreSQL DB Connection =====
// const db = new pg.Client({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
//   ...(isProduction && {
//     ssl: { require: true, rejectUnauthorized: false },
//   }),
// });

// db.connect()
//   .then(() => console.log('✅ Connected to PostgreSQL database'))
//   .catch((err) => console.error('❌ Database connection error:', err));

// // ===== Middleware =====
// app.use(cors({
//   origin: isProduction ? 'https://prithwe-carbon-footprint-tracker.onrender.com' : 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Session Configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'default_secret',
//   resave: false,
//   saveUninitialized: false,
//   store: new MemoryStore({ checkPeriod: 86400000 }),
//   cookie: {
//     secure: isProduction,  // Secure cookies in production (HTTPS)
//     httpOnly: true,
//     sameSite: isProduction ? 'none' : 'lax',  // Handle cookies in production
//     maxAge: 86400000  // 1 day
//   }
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // ===== Passport Local Strategy =====
// passport.use(
//   new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
//     try {
//       const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
//       if (result.rows.length === 0) return done(null, false, { message: 'No user found' });
//       const user = result.rows[0];
//       const isMatch = await bcrypt.compare(password, user.password);
//       return isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password' });
//     } catch (err) {
//       console.error(err);
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => done(null, user.id)); // Store user ID in session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
//     done(null, result.rows[0]);
//   } catch (err) {
//     done(err);
//   }
// });

// // ===== Google Strategy =====
// async function findOrCreateUser(googleId, profile) {
//   const existing = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
//   if (existing.rows.length > 0) return existing.rows[0];

//   const hashed = await bcrypt.hash('defaultpassword', 10);
//   const newUser = await db.query(
//     'INSERT INTO users (google_id, email, name, password, type, isVerified) VALUES ($1, $2, $3, $4, $5, true) RETURNING *',
//     [googleId, profile.emails[0].value, profile.displayName, hashed, 'user']
//   );
//   return newUser.rows[0];
// }

// passport.use(new GoogleStrategy({
//   clientID: process.env.OAUTH_CLIENT_ID,
//   clientSecret: process.env.OAUTH_SECRET,
//   callbackURL: isProduction
//     ? 'https://prithwe-carbon-footprint-tracker.onrender.com/auth/google/prithwe'
//     : 'http://localhost:3001/auth/google/prithwe',
//   userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
// }, async (accessToken, refreshToken, profile, cb) => {
//   try {
//     const user = await findOrCreateUser(profile.id, profile);
//     return cb(null, user);
//   } catch (err) {
//     return cb(err);
//   }
// }));

// // ===== Google Routes =====
// app.get('/auth/google', (req, res, next) => {
//   res.cookie('userType', req.query.userType, {
//     httpOnly: true,
//     sameSite: isProduction ? 'none' : 'lax',
//     secure: isProduction,
//   });
//   passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
// });

// app.get('/auth/google/prithwe', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
//   await db.query('UPDATE users SET type = $1 WHERE email = $2', [req.cookies.userType, req.user.email]);
//   res.clearCookie('userType');
//   res.redirect(isProduction ? 'https://prithwe-carbon-footprint-tracker.onrender.com' : 'http://localhost:5173');
// });

// // ===== API Routes =====
// app.use('/api/household', householdRouter);
// app.use('/api/contact', contactUsRouter);
// app.use('/api/auth', authRouter);
// app.use('/api/business', businessRouter);
// app.use('/api/admin', adminRouter);

// // ===== Serve React Frontend in Production =====
// if (isProduction) {
//   const clientDist = path.join(__dirname, '../client/dist');
//   app.use(express.static(clientDist));
//   app.get('*', (_, res) => res.sendFile(path.join(clientDist, 'index.html')));
// } else {
//   app.get('/', (_, res) => res.send('App is under development.'));
// }

// // ===== Keep Render Alive =====
// const pingURL = 'https://prithwe-carbon-footprint-tracker.onrender.com/';
// setInterval(() => {
//   axios.get(pingURL)
//     .then(res => console.log(`🌐 Pinged at ${new Date().toISOString()} — Status: ${res.status}`))
//     .catch(err => console.error('⚠️ Ping error:', err.message));
// }, 800000);

// // ===== Start Server =====
// app.listen(port, () => {
//   console.log(`🚀 Server listening on port ${port}`);
// });


import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import memorystore from 'memorystore';
import pg from 'pg';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { fileURLToPath } from 'url';

import householdRouter from './householdData.js';
import contactUsRouter from './contactUs.js';
import authRouter from './Authentication.js';  // Import Authentication.js
import businessRouter from './businessData.js';
import adminRouter from './adminData.js';

dotenv.config();
const app = express();
const MemoryStore = memorystore(session);
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== PostgreSQL DB Connection =====
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ...(isProduction && {
    ssl: { require: true, rejectUnauthorized: false },
  }),
});

db.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// ===== Middleware =====
app.use(cors({
  origin: isProduction ? 'https://prithwe-carbon-footprint-tracker.onrender.com' : 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 }),
  cookie: {
    secure: isProduction,  // Secure cookies in production (HTTPS)
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',  // Handle cookies in production
    maxAge: 86400000  // 1 day
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/household', householdRouter);
app.use('/api/contact', contactUsRouter);
app.use('/api/auth', authRouter);  // Use Authentication.js router
app.use('/api/business', businessRouter);
app.use('/api/admin', adminRouter);

// ===== Serve React Frontend in Production =====
if (isProduction) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_, res) => res.sendFile(path.join(clientDist, 'index.html')));
} else {
  app.get('/', (_, res) => res.send('App is under development.'));
}

// ===== Keep Render Alive =====
const pingURL = 'https://prithwe-carbon-footprint-tracker.onrender.com/';
setInterval(() => {
  axios.get(pingURL)
    .then(res => console.log(`🌐 Pinged at ${new Date().toISOString()} — Status: ${res.status}`))
    .catch(err => console.error('⚠️ Ping error:', err.message));
}, 800000);

// ===== Start Server =====
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
