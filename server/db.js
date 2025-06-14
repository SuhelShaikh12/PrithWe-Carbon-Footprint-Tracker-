


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



// // backend/db.js
// import dotenv from 'dotenv';
// dotenv.config();

// import pkg from 'pg';
// const { Pool } = pkg;

// const isProduction = process.env.NODE_ENV === 'production';

// const pool = new Pool({
//   connectionString: process.env.PG_CONNECTION_STRING,
//   ssl: isProduction ? { rejectUnauthorized: false } : false,
// });

// // Immediately connect and log status
// pool.connect()
//   .then(() => console.log('✅ Connected to the PostgreSQL database'))
//   .catch((err) => console.error('❌ Database connection error:', err));

// // Export a query function to use across your app
// export const query = (text, params) => pool.query(text, params);

// // Also export pool if needed directly
// export default pool;



// // backend/db.js
// import dotenv from "dotenv";
// dotenv.config();

// import pkg from "pg";
// const { Pool } = pkg;

// const isProduction = process.env.NODE_ENV === "production";

// const pool = new Pool({
//   connectionString: process.env.PG_CONNECTION_STRING,
//   ssl: isProduction ? { rejectUnauthorized: false } : false,
// });

// // Run a test query to check the connection
// pool.query("SELECT NOW()")
//   .then(() => console.log("✅ Connected to the PostgreSQL database"))
//   .catch((err) => console.error("❌ Database connection error:", err));

// // Export query utility for reuse
// export const query = (text, params) => pool.query(text, params);

// // Export pool if needed for advanced use
// export default pool;


// db.js
import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;


dotenv.config();

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { 
    rejectUnauthorized: false
  }
});

// Test connection
(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// Named export
export { pool };

// Default export
export default pool;