


// // backend/utils/mailer.js
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// import { query } from "../db.js"; // adjust path according to your structure

// dotenv.config();

// const __dirname = dirname(fileURLToPath(import.meta.url));

// // Helper to wrap async functions for express error handling (if you want to use in middleware)
// const wrapAsync = (fn) => {
//   return (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch((err) => {
//       next(err);
//     });
//   };
// };

// // Configure Nodemailer transporter with Gmail SMTP and app password
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true if port 465, false for 587
//   requireTLS: true,
//   auth: {
//     user: process.env.MAIL,
//     pass: process.env.APP_PASSWORD,
//   },
// });

// // Generate a random 6-digit OTP string
// export function generateSixDigitOTP() {
//   let otp = "";
//   for (let i = 0; i < 6; i++) {
//     otp += Math.floor(Math.random() * 10);
//   }
//   return otp;
// }

// // Read and inject OTP into email HTML template
// const getHtmlTemplate = (otp) => {
//   const templatePath = path.resolve(__dirname, "EmailTemplates", "SendOtp.html");
//   const template = fs.readFileSync(templatePath, "utf8");
//   return template.replace("{{otp}}", otp);
// };

// // Send OTP email and update OTP + timestamp in DB
// export const sendOTP = wrapAsync(async (email, otp, subject) => {
//   try {
//     const htmlContent = getHtmlTemplate(otp);

//     const mailOptions = {
//       from: process.env.MAIL,
//       to: email,
//       subject,
//       text: `Your OTP for prithwe is: ${otp}`, // keep your brand name
//       html: htmlContent,
//     };

//     await transporter.sendMail(mailOptions);

//     const timestamp = Date.now();

//     // Update OTP and timestamp for user identified by email
//     return await query(
//       "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE email = $3",
//       [otp, timestamp, email]
//     );
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw error; // Propagate error for upstream handling
//   }
// });


// // backend/utils/mailer.js
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import { query } from "../db.js";

// dotenv.config();

// const __dirname = dirname(fileURLToPath(import.meta.url));

// // Wrap async middleware function
// const wrapAsync = (fn) => {
//   return (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };

// // Create Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   requireTLS: true,
//   auth: {
//     user: process.env.MAIL,
//     pass: process.env.APP_PASSWORD,
//   },
// });

// // Generate 6-digit OTP
// export function generateSixDigitOTP() {
//   let otp = "";
//   for (let i = 0; i < 6; i++) {
//     otp += Math.floor(Math.random() * 10);
//   }
//   return otp;
// }

// // Read OTP template and inject code
// const getHtmlTemplate = (otp) => {
//   const templatePath = path.resolve(__dirname, "EmailTemplates", "SendOtp.html");
//   const template = fs.readFileSync(templatePath, "utf8");
//   return template.replace("{{otp}}", otp);
// };

// // Send OTP and update DB
// export const sendOTP = wrapAsync(async (email, otp, subject) => {
//   try {
//     const normalizedEmail = email.trim().toLowerCase();
//     console.log("📧 Normalized Email:", normalizedEmail);

//     const result = await query("SELECT * FROM users WHERE LOWER(email) = $1", [normalizedEmail]);
//     console.log("🔎 DB Lookup Result:", result.rows);

//     if (result.rows.length === 0) {
//       throw new Error("Error sending OTP. Make sure you have registered this mail.");
//     }

//     const htmlContent = getHtmlTemplate(otp);

//     const mailOptions = {
//       from: process.env.MAIL,
//       to: normalizedEmail,
//       subject,
//       text: `Your OTP for prithwe is: ${otp}`,
//       html: htmlContent,
//     };

//     await transporter.sendMail(mailOptions);

//     const timestamp = Date.now();

//     return await query(
//       "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE LOWER(email) = $3",
//       [otp, timestamp, normalizedEmail]
//     );
//   } catch (error) {
//     console.error("❌ Error sending OTP:", error.message);
//     throw error;
//   }
// });




import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { query } from "../db.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const wrapAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // requireTLS: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Generate 6-digit OTP
export function generateSixDigitOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const getHtmlTemplate = (otp) => {
  const templatePath = path.resolve(__dirname, "EmailTemplates", "SendOtp.html");
  const template = fs.readFileSync(templatePath, "utf8");
  return template.replace("{{otp}}", otp);
};

export const sendOTP = wrapAsync(async (email, otp, subject) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    console.log("📧 Normalized Email:", normalizedEmail);

    const result = await query(
      "SELECT * FROM users WHERE LOWER(email) = $1 AND verified = false",
      [normalizedEmail]
    );

    console.log("🔎 DB Lookup Result:", result.rows);

    if (result.rows.length === 0) {
      throw new Error("User not found or already verified. Cannot send OTP.");
    }

    const htmlContent = getHtmlTemplate(otp);

    const mailOptions = {
      from: process.env.MAIL,
      to: normalizedEmail,
      subject,
      text: `Your OTP for Prithwe is: ${otp}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to", normalizedEmail);

    const timestamp = Date.now();

    await query(
      "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE LOWER(email) = $3",
      [otp, timestamp, normalizedEmail]
    );

    console.log("✅ OTP saved to DB for", normalizedEmail);
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    throw error;
  }
});
