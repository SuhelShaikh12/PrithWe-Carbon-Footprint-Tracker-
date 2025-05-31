


// import dotenv from 'dotenv';
// dotenv.config();

// import pkg from 'pg';
// const { Pool } = pkg;

// // Determine if the app is running in production
// const isProduction = process.env.NODE_ENV === 'production';

// const pool = new Pool({
//   connectionString: process.env.PG_CONNECTION_STRING,
//   ssl: isProduction
//     ? { rejectUnauthorized: false } // Allow self-signed certs
//     : false,
// });

// pool.connect()
//   .then(() => console.log('✅ Connected to the PostgreSQL database'))
//   .catch((err) => console.error('❌ Database connection error:', err));

// export const query = (text, params) => pool.query(text, params);
// export default pool;



// backend/db.js
import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Immediately connect and log status
pool.connect()
  .then(() => console.log('✅ Connected to the PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Export a query function to use across your app
export const query = (text, params) => pool.query(text, params);

// Also export pool if needed directly
export default pool;
