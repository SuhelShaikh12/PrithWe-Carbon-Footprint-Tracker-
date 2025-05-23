// // server.js (Node.js/Express backend)

// import express, { request, response } from 'express';
// import bodyParser from 'body-parser';
// import pg from 'pg';
// import bcrypt from 'bcrypt';
// import session from 'express-session';
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import cors from 'cors'; // Import cors module
// import env from "dotenv";
// import cookieParser from 'cookie-parser'; // Import cookie-parser module
// //import { query } from './db.js';



// const app = express();
// const port = 3001;
// const saltRounds = 10;

// env.config();


// // Enable CORS
// app.use(cors({
//   origin: 'http://localhost:5173', // Replace with your frontend origin
//   credentials: true,
// }));
// app.use(cookieParser()); // Add cookie-parser middleware

// // Middleware setup
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set secure to false for development
//   })
// );


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


// app.use(passport.initialize());
// app.use(passport.session());

// //app.use(routes)

// // PostgreSQL database connection
// const db = new pg.Client({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });
// db.connect();






// // Register endpoint
// app.post('/register', async (req, res) => {
//   const { name,email, password,type } = req.body;

//   try {
//     const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
//       email,
//     ]);

//     if (checkResult.rows.length > 0) {
//       res.status(400).send('User already exists');
//     } else {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error('Error hashing password:', err);
//           res.status(500).send('Error registering user');
//         } else {
//           const result = await db.query(
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


// app.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) { return next(err); }
//     if (!user) { return res.status(401).send('Invalid credentials'); }
//     req.logIn(user, (err) => {
//       if (err) { return next(err); }
//       req.session.userId = user.id; // Store the user's ID in the session
//       return res.status(200).send('Login successful');
//     });
//   })(req, res, next);
// });




// app.get('/login/status',
// (request,response)=>{
//   console.log("inside /login/status")
//   console.log(request.user);
//   console.log(request.user.id)//it sends the unique id i.e. UUID of the logged in user ...if not working ...try restarting client server
//   console.log(request.user.type)//it outputs the type of user
//   console.log(request.session);
//   request.session.userId = request.user.id; // Store the user ID in the session
//   //console.log(request.session.id)
//   return request.user ? response.send(request.user) : response.sendStatus(401);
  
// })

// app.get('/user-type', (req, res) => {
//   console.log("inside user type")
//   req.session.userType=req.user.type
//   // Retrieve user type from the session or database
//   const userType = req.session.userType; // Assuming userType is stored in the session upon login
//   //const userType = req.user.type
//   console.log(userType)
  
//   //res.json({ userType });
//   return req.user ? res.send(req.user) : res.sendStatus(401);
  
// });






// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'email', // Specify the field name for the username
//       passwordField: 'password', // Specify the field name for the password
//     },
//     async function (email, password, done) {
//       try {
//         //console.log(req.body);
//         console.log('Email:', email); // Log the email
//         console.log('Password:', password); // Log the password

//         const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

//         console.log('Query Result:', result.rows); // Log the query result

//         if (result.rows.length > 0) {
//           const user = result.rows[0];
//           const storedHashedPassword = user.password;

//           // Use await with bcrypt.compare
//           const valid = await bcrypt.compare(password, storedHashedPassword);

//           if (valid) {
//             console.log('Authentication successful:', user);
//             return done(null, user);
//           } else {
//             console.log('Authentication failed: Invalid password');
//             return done(null, false);
//           }
//         } else {
//           console.log('Authentication failed: User not found');
//           return done(null, false);
//         }
//       } catch (err) {
//         console.error('Error during authentication:', err);
//         return done(err);
//       }
//     }
//   )
// );




// app.post('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error('Error logging out:', err);
//       return res.sendStatus(500); // Internal server error
//     }
//     return res.sendStatus(200); // Success
//   });
// });







// passport.serializeUser((user, done) => {
//   console.log("serializeUser inside")
//   console.log(user);
  
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     console.log("deserializeUser inside i am")
//     console.log(id)
//     const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
//     const user = result.rows[0];
//     done(null, user);
//   } catch (err) {
//     console.log(err);
//     done(err,null);
//   }
// });



// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



// server.js (Node.js/Express backend)

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
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info.message || 'Invalid credentials');

    req.logIn(user, (err) => {
      if (err) return next(err);
      req.session.userId = user.id;
      res.status(200).send('Login successful');
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
