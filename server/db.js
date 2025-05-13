

// import dotenv from 'dotenv';
// dotenv.config(); 

// import pkg from 'pg';
// const { Pool } = pkg;

// const isProduction = process.env.NODE_ENV === 'production';

// const pool = new Pool({
//   // connectionString: process.env.DB_URI,
//   // ssl: {
//   //   rejectUnauthorized: false, // Accept self-signed certificates (Render uses this)
//   // },
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
//  ssl: isProduction ? { rejectUnauthorized: true } : false,
// });

// pool.connect()
//   .then(() => console.log('✅ Connected to the database'))
//   .catch(err => console.error('❌ Database connection error:', err));

// export const query = (text, params) => pool.query(text, params);
// export default pool;

// db.js

import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

// Determine the environment
const isProduction = process.env.NODE_ENV === 'production';

// Use Render connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://prithvi_db_user:HR2tJlCVvoQrDT4jAQbB0dBj7gERACdd@dpg-d0heie3e5dus73av1ds0-a/prithvi_db',
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.connect()
  .then(() => console.log('✅ Connected to the database'))
  .catch(err => console.error('❌ Database connection error:', err));

export const query = (text, params) => pool.query(text, params);
export default pool;
