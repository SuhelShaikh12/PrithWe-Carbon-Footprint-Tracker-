

// import dotenv from 'dotenv';
// dotenv.config();

// import pkg from 'pg';
// const { Pool } = pkg;

// // Determine the environment
// const isProduction = process.env.NODE_ENV === 'production';

// // Use Render connection string
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL || 'postgresql://prithvi_db_user:HR2tJlCVvoQrDT4jAQbB0dBj7gERACdd@dpg-d0heie3e5dus73av1ds0-a/prithvi_db',
//   ssl: isProduction ? { rejectUnauthorized: false } : false
// });

// // Test the connection
// pool.connect()
//   .then(() => console.log('✅ Connected to the database'))
//   .catch(err => console.error('❌ Database connection error:', err));

// export const query = (text, params) => pool.query(text, params);
// export default pool;


// db.js

// import dotenv from 'dotenv';
// dotenv.config();

// import pkg from 'pg';
// const { Pool } = pkg;

// // Determine if the app is running in production
// const isProduction = process.env.NODE_ENV === 'production';

// // Configure the database connection
// const pool = new Pool({
//   connectionString: process.env.PG_CONNECTION_STRING,
//   ssl: isProduction ? { rejectUnauthorized: false } : false,
// });

// // Test the database connection
// pool.connect()
//   .then(() => console.log('✅ Connected to the PostgreSQL database'))
//   .catch((err) => console.error('❌ Database connection error:', err));

// // Export query function
// export const query = (text, params) => pool.query(text, params);
// export default pool;

import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

// Determine if the app is running in production
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Allow self-signed certs
    : false,
});

pool.connect()
  .then(() => console.log('✅ Connected to the PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

export const query = (text, params) => pool.query(text, params);
export default pool;
