

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
// import { fileURLToPath } from 'url';

// import householdRouter from './householdData.js';
// import contactUsRouter from './contactUs.js';
// import authRouter from './Authentication.js';  // Import Authentication.js
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

// // API Routes
// app.use('/api/household', householdRouter);
// app.use('/api/contact', contactUsRouter);
// app.use('/api/auth', authRouter);  // Use Authentication.js router
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
import authRouter from './Authentication.js';
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

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 }),
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 86400000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ===== Routes =====
app.use('/api/household', householdRouter);
app.use('/api/contact', contactUsRouter);
app.use('/api/auth', authRouter);
app.use('/api/business', businessRouter);
app.use('/api/admin', adminRouter);

// ===== Add Login Status & User Type Routes =====
app.get('/api/auth/login/status', (req, res) => {
  console.log('➡️ Checking login status...');
  if (req.user) {
    console.log('✅ User logged in:', req.user);
    req.session.userId = req.user.id;
    return res.status(200).json(req.user);
  } else {
    console.log('❌ No user session');
    return res.sendStatus(401);
  }
});

app.get('/api/auth/user-type', (req, res) => {
  console.log('➡️ Checking user type...');
  if (req.user) {
    req.session.userType = req.user.type;
    console.log('✅ User type:', req.user.type);
    return res.status(200).json({ type: req.user.type });
  } else {
    console.log('❌ No user session');
    return res.sendStatus(401);
  }
});

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
