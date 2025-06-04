


// // passport.js
// // passport.js (ESM version)
// // passport.js
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import bcrypt from 'bcrypt';
// import { pool } from './db.js'; // named import

// passport.use(new LocalStrategy(
//   { usernameField: 'email' },
//   async (email, password, done) => {
//     try {
//       const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//       if (!rows.length) {
//         return done(null, false, { message: 'Incorrect email.' });
//       }

//       const user = rows[0];
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
//     if (!rows.length) {
//       return done(new Error('User not found'));
//     }
//     done(null, rows[0]);
//   } catch (err) {
//     done(err);
//   }
// });

// export default passport;



import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { pool } from './db.js';

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      if (!rows.length) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const user = rows[0];

      // Optional: check if user email is verified here (could also be done in login route)
      // if (!user.email_verified) {
      //   return done(null, false, { message: 'Email not verified.' });
      // }

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
