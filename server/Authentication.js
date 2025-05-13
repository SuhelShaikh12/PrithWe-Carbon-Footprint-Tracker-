// import express from 'express';
// import bodyParser from 'body-parser';
// import bcrypt from 'bcrypt';
// import session from 'express-session';
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import cors from 'cors';
// import env from 'dotenv';
// import cookieParser from 'cookie-parser';
// import { query } from './db.js';
// import memorystore from 'memorystore';
// import { generateSixDigitOTP, sendOTP } from './SendOTP.js';

// const MemoryStore = memorystore(session);
// const router = express.Router();
// const app = express();
// const saltRounds = 10;

// env.config();

// app.use(cors({
//   origin: 'http://localhost:5173', // Replace with your frontend origin
//   credentials: true,
// }));

// app.use(cookieParser());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false, maxAge: 86400000 },
//     store: new MemoryStore({ checkPeriod: 86400000 }),
//   })
// );

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(passport.initialize());
// app.use(passport.session());


// router.post('/register', async (req, res) => {
//   const { name,email, password,type } = req.body;

//   try {
//     const checkResult = await query('SELECT * FROM users WHERE email = $1', [
//       email,
//     ]);//db.query

//     if (checkResult.rows.length > 0) {
//       res.status(400).send('User already exists');
//     } else {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error('Error hashing password:', err);
//           res.status(500).send('Error registering user');
//         } else {
//           const result = await query(
//             'INSERT INTO users (name,email, password,type) VALUES ($1, $2, $3,$4) RETURNING *',
//             [name,email, hash,type]
//           );
//           const user = result.rows[0];
//           res.status(201).send(user);
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Error registering user');
//   }
// });

// router.post('/login', (req, res, next) => {
//   if(req.body.email==process.env.ADMIN_MAIL && req.body.password ==process.env.ADMIN_PASS)
//       return res.status(200).json({type:"admin"});
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

// router.post('/sendOTP', async (req, res) => {
//   try {
//     const email = req.body.email;
//     const subject = req.body.subject;
//     const otp = generateSixDigitOTP();
//     await sendOTP(email, otp, subject);
//     const result = await query('UPDATE users SET otp = $1 WHERE email = $2 RETURNING *', [otp, email]);
//     if (result.rowCount === 0) {
//       res.status(404).json({ success: false, message: "Email not found" });
//     } else {
//       res.status(200).json({ success: true, message: "OTP Sent" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// });

// router.post('/verifyOTP', async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const result = await query('SELECT otp FROM users WHERE email = $1', [email]);
//     if (result.rows.length === 0) {
//       res.status(404).json({ success: false, message: "Email not found" });
//       return;
//     }
//     const storedOtp = result.rows[0].otp;
//     if (storedOtp === otp) {
//       await query('UPDATE users SET isverified = true WHERE email = $1', [email]);
//       res.status(200).json({ success: true, message: "OTP Verified" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to verify OTP" });
//   }
// });

// router.post('/resetPassword', async (req, res) => {
//   const { email, newPassword } = req.body;
//   try {
//     bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
//       if (err) {
//         res.status(500).send('Error Reseting Password');
//       } else {
//         const result = await query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [hash, email]);
//         const user = result.rows[0];
//         res.status(201).send(user);
//       }
//     });
//   } catch (err) {
//     res.status(500).send('Error Reseting Password');
//   }
// });

// router.get('/login/status', (req, res) => {
//   return req.user ? res.send(req.user) : res.sendStatus(401);
// });

// router.get('/user-type', (req, res) => {
//   return req.user ? res.send(req.user) : res.sendStatus(401);
// });

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

// router.post('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.sendStatus(500);
//     }
//     return res.sendStatus(200);
//   });
// });

// export default router;


import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { check, validationResult } from 'express-validator';
import { query } from './db.js';  // Your DB connection
import { generateSixDigitOTP, sendOTP } from './SendOTP.js';  // OTP helper functions
import memorystore from 'memorystore';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import env from 'dotenv';

const MemoryStore = memorystore(session);
const router = express.Router();
const saltRounds = 10;

env.config();

// Initialize session store and middleware
router.use(cookieParser());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 86400000 },
    store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);
router.use(passport.initialize());
router.use(passport.session());

// ===== POST Register =====
router.post('/register', [
  check('email').isEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, type } = req.body;
  try {
    const checkResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkResult.rows.length > 0) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await query(
      'INSERT INTO users (email, name, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, name, hashedPassword, type || 'user']
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ===== POST Login =====
router.post('/login', (req, res, next) => {
  if (req.body.email === process.env.ADMIN_MAIL && req.body.password === process.env.ADMIN_PASS) {
    return res.status(200).json({ type: "admin" });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).send('Invalid credentials'); }
    if (!user.isverified) { return res.status(402).send("Not Verified"); }

    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.session.userId = user.id;
      return res.status(200).json({ type: "user" });
    });
  })(req, res, next);
});

// ===== Send OTP =====
router.post('/sendOTP', async (req, res) => {
  try {
    const email = req.body.email;
    const otp = generateSixDigitOTP();
    await sendOTP(email, otp, "Verify OTP");
    const result = await query('UPDATE users SET otp = $1 WHERE email = $2 RETURNING *', [otp, email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    return res.status(200).json({ success: true, message: "OTP Sent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ===== Verify OTP =====
router.post('/verifyOTP', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await query('SELECT otp FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const storedOtp = result.rows[0].otp;
    if (storedOtp === otp) {
      await query('UPDATE users SET isverified = true WHERE email = $1', [email]);
      return res.status(200).json({ success: true, message: "OTP Verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
});

// ===== Reset Password =====
router.post('/resetPassword', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const result = await query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [hashedPassword, email]);
    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Error resetting password' });
  }
});

// ===== Get User Status =====
router.get('/login/status', (req, res) => {
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

// ===== Logout =====
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
});

// ===== Serialize and Deserialize User =====
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default router;
