// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Pool } from 'pg';

// const pool = new Pool({
//   connectionString: process.env.PG_CONNECTION_STRING,
//   ssl: { rejectUnauthorized: false },
// });

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
//     if (res.rows.length > 0) done(null, res.rows[0]);
//     else done(null, false);
//   } catch (err) {
//     done(err, null);
//   }
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.OAUTH_CLIENT_ID,
//       clientSecret: process.env.OAUTH_SECRET,
//       callbackURL: '/api/auth/google/callback',
//       passReqToCallback: true,
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         const googleId = profile.id;
//         const userType = req.session.userType;

//         if (!userType) return done(new Error('User type not set in session'));

//         // Check if user exists
//         const res = await pool.query(
//           'SELECT * FROM users WHERE google_id = $1 AND type = $2',
//           [googleId, userType]
//         );

//         if (res.rows.length > 0) return done(null, res.rows[0]);

//         // Insert new user
//         const insertRes = await pool.query(
//           'INSERT INTO users (name, email, google_id, type) VALUES ($1, $2, $3, $4) RETURNING *',
//           [profile.displayName, email, googleId, userType]
//         );

//         done(null, insertRes.rows[0]);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );

// export default passport;


import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { db } from "./index.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const type = req.body.type;
        if (!type) {
          return done(null, false, { message: "User type is required." });
        }
        const normalizedEmail = email.trim().toLowerCase();

        const userResult = await db.query(
          "SELECT * FROM users WHERE LOWER(email) = $1 AND type = $2",
          [normalizedEmail, type]
        );

        if (userResult.rows.length === 0) {
          return done(null, false, { message: "Incorrect email or user type." });
        }

        const user = userResult.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return done(null, false);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});
