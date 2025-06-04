



// // import nodemailer from "nodemailer";
// // import dotenv from "dotenv";
// // import fs from "fs";
// // import path from "path";
// // import { fileURLToPath } from "url";
// // import { dirname } from "path";
// // import { query } from "../db.js";

// // dotenv.config();

// // const __dirname = dirname(fileURLToPath(import.meta.url));

// // const wrapAsync = (fn) => {
// //   return (req, res, next) => {
// //     Promise.resolve(fn(req, res, next)).catch(next);
// //   };
// // };

// // const transporter = nodemailer.createTransport({
// //   // host: "smtp.gmail.com",
// //   // port: 587,
// //   // secure: false,
// //   // requireTLS: true,
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.MAIL,
// //     pass: process.env.APP_PASSWORD,
// //   },
// // });

// // // Generate 6-digit OTP
// // export function generateSixDigitOTP() {
// //   return Math.floor(100000 + Math.random() * 900000).toString();
// // }

// // const getHtmlTemplate = (otp) => {
// //   const templatePath = path.resolve(__dirname, "EmailTemplates", "SendOtp.html");
// //   const template = fs.readFileSync(templatePath, "utf8");
// //   return template.replace("{{otp}}", otp);
// // };

// // export const sendOTP = wrapAsync(async (email, otp, subject) => {
// //   try {
// //     const normalizedEmail = email.trim().toLowerCase();
// //     console.log("📧 Normalized Email:", normalizedEmail);

// //     const result = await query(
// //       "SELECT * FROM users WHERE LOWER(email) = $1 AND verified = false",
// //       [normalizedEmail]
// //     );

// //     console.log("🔎 DB Lookup Result:", result.rows);

// //     if (result.rows.length === 0) {
// //       throw new Error("User not found or already verified. Cannot send OTP.");
// //     }

// //     const htmlContent = getHtmlTemplate(otp);

// //     const mailOptions = {
// //       from: process.env.MAIL,
// //       to: normalizedEmail,
// //       subject,
// //       text: `Your OTP for Prithwe is: ${otp}`,
// //       html: htmlContent,
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log("✅ OTP email sent to", normalizedEmail);

// //     const timestamp = Date.now();

// //     await query(
// //       "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE LOWER(email) = $3",
// //       [otp, timestamp, normalizedEmail]
// //     );

// //     console.log("✅ OTP saved to DB for", normalizedEmail);
// //   } catch (error) {
// //     console.error("❌ Error sending OTP:", error.message);
// //     throw error;
// //   }
// // });


// // import nodemailer from "nodemailer";
// // import dotenv from "dotenv";
// // import fs from "fs";
// // import path from "path";
// // import { db } from "./db.js";

// // dotenv.config();

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.MAIL,
// //     pass: process.env.APP_PASSWORD,
// //   },
// // });

// // export function generateSixDigitOTP() {
// //   return Math.floor(100000 + Math.random() * 900000).toString();
// // }

// // const getHtmlTemplate = (otp) => {
// //   const templatePath = path.resolve("src/server/EmailTemplates/SendOtp.html");
// //   const template = fs.readFileSync(templatePath, "utf8");
// //   return template.replace("{{otp}}", otp);
// // };


// // export async function sendOTP(email) {
// //   const normalizedEmail = email.trim().toLowerCase();

// //   const result = await db.query(
// //     "SELECT * FROM users WHERE LOWER(email) = $1 AND verified = false",
// //     [normalizedEmail]
// //   );

// //   if (result.rows.length === 0) {
// //     throw new Error("User not found or already verified");
// //   }

// //   const otp = generateSixDigitOTP();
// //   const htmlContent = getHtmlTemplate(otp);

// //   const mailOptions = {
// //     from: process.env.MAIL,
// //     to: normalizedEmail,
// //     subject: "Your OTP for Prithwe",
// //     text: `Your OTP for Prithwe is: ${otp}`,
// //     html: htmlContent,
// //   };

// //   await transporter.sendMail(mailOptions);

// //   const timestamp = Date.now();
// //   await db.query(
// //     "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE LOWER(email) = $3",
// //     [otp, timestamp, normalizedEmail]
// //   );

// //   return result.rows[0].id; // userId
// // }



// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import db from "./db.js";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,      // Use EMAIL_USER from .env
//     pass: process.env.EMAIL_PASS,      // Use EMAIL_PASS from .env
//   },
// });

// export function generateSixDigitOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Use __dirname equivalent in ES modules for robust template loading
// const getHtmlTemplate = (otp) => {
//   // Adjust path if needed based on where this file is located
//   const templatePath = path.resolve(process.cwd(), "src/server/EmailTemplates/SendOtp.html");
//   const template = fs.readFileSync(templatePath, "utf8");
//   return template.replace("{{otp}}", otp);
// };

// export async function sendOTP(email) {
//   const normalizedEmail = email.trim().toLowerCase();

//   // Query users without filtering by verified status
//   const result = await db.query(
//     "SELECT * FROM users WHERE LOWER(email) = $1",
//     [normalizedEmail]
//   );

//   if (result.rows.length === 0) {
//     throw new Error("Email not registered");
//   }

//   if (result.rows[0].verified) {
//     throw new Error("Email is already verified");
//   }

//   const otp = generateSixDigitOTP();
//   const htmlContent = getHtmlTemplate(otp);

//   const mailOptions = {
//     from: process.env.EMAIL_USER,  // Use EMAIL_USER here as sender
//     to: normalizedEmail,
//     subject: "Your OTP for Prithwe",
//     text: `Your OTP for Prithwe is: ${otp}`,
//     html: htmlContent,
//   };

//   // Send OTP email
//   await transporter.sendMail(mailOptions);

//   const timestamp = Date.now();
//   // Save OTP and timestamp in DB for verification
//   await db.query(
//     "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE LOWER(email) = $3",
//     [otp, timestamp, normalizedEmail]
//   );

//   return result.rows[0].id; // Return user id for later use
// }


// SentOTP.js
import nodemailer from 'nodemailer';

// Generate a 6-digit numeric OTP
export function generateOTP() {
  let otp = '';
  const chars = '0123456789';
  for (let i = 0; i < 6; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}

// Send OTP to email using Nodemailer
export async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(message);
}
