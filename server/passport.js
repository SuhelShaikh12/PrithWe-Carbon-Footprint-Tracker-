

// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcrypt";
// import { db } from "./index.js";

// // Local Strategy for Login
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true, // Allows access to req.body.type
//     },
//     async (req, email, password, done) => {
//       try {
//         const type = req.body.type;
//         if (!type) {
//           return done(null, false, { message: "User type is required." });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         const result = await db.query(
//           "SELECT * FROM users WHERE LOWER(email) = $1 AND type = $2",
//           [normalizedEmail, type]
//         );

//         if (result.rows.length === 0) {
//           return done(null, false, { message: "Incorrect email or user type." });
//         }

//         const user = result.rows[0];
//         const isPasswordMatch = await bcrypt.compare(password, user.password);

//         if (!isPasswordMatch) {
//           return done(null, false, { message: "Incorrect password." });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// // Serialize user to session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
//     if (result.rows.length === 0) {
//       return done(null, false);
//     }
//     done(null, result.rows[0]);
//   } catch (err) {
//     done(err);
//   }
// });




// passport.js
// passport.js (ESM version)
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { pool } from './db.js';

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!rows.length) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!rows.length) {
      return done(new Error('User not found'));
    }
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});

export default passport;
