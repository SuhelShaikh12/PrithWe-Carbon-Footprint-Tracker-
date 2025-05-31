// import nodemailer from "nodemailer"
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// import { query } from './db.js';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// dotenv.config();

// const wrapAsync = (fn) => {
//     return (req, res, next) => {
//       Promise.resolve(fn(req, res, next)).catch((err) => {
//         next(err);
//       });
//     };
//   };
  
 

// let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 587, false for other ports
//     requireTLS: true,
//     auth: {
//       user: process.env.MAIL,
//       pass: process.env.APP_PASSWORD 
//     },
// });

// export function generateSixDigitOTP() {
//   let otp = "";
//   for (let i = 0; i < 6; i++) {
//     otp += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
//   }
//   return otp;
// }

// const getHtmlTemplate = (otp) => {

//   const templatePath = path.resolve(__dirname, "EmailTemplates", "SendOtp.html");

//   //const templatePath = path.resolve(__dirname, "EmailTemplate", "emailTemplate.html");

//   let template = fs.readFileSync(templatePath, "utf8");
//   return template.replace("{{otp}}", otp);
// };


// export const sendOTP = wrapAsync(async (email, otp, subject) => {
//   try { 
//     const htmlContent = getHtmlTemplate(otp);

//     const mailOptions = {
//       from: process.env.MAIL,
//       to: email,
//       subject: subject,
//       text: `Your OTP for pritwe is: ${otp}`,
//       html: htmlContent
//     };
//     await transporter.sendMail(mailOptions);
//     const timestamp = Date.now(); // Getting current timestamp

//     // Storing OTP and timestamp in the database
//    return await query('UPDATE users SET otp = $1, otp_timestamp = $2 WHERE email = $3', [otp, timestamp, email]); 

//   } catch (error) {
//     console.log(error);
//   }
// });


// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { query } from "../db.js"; // adjust path according to your structure

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Helper to wrap async functions for express error handling (if you want to use in middleware)
const wrapAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

// Configure Nodemailer transporter with Gmail SMTP and app password
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true if port 465, false for 587
  requireTLS: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Generate a random 6-digit OTP string
export function generateSixDigitOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

// Read and inject OTP into email HTML template
const getHtmlTemplate = (otp) => {
  const templatePath = path.resolve(__dirname, "EmailTemplates", "SendOtp.html");
  const template = fs.readFileSync(templatePath, "utf8");
  return template.replace("{{otp}}", otp);
};

// Send OTP email and update OTP + timestamp in DB
export const sendOTP = wrapAsync(async (email, otp, subject) => {
  try {
    const htmlContent = getHtmlTemplate(otp);

    const mailOptions = {
      from: process.env.MAIL,
      to: email,
      subject,
      text: `Your OTP for prithwe is: ${otp}`, // keep your brand name
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    const timestamp = Date.now();

    // Update OTP and timestamp for user identified by email
    return await query(
      "UPDATE users SET otp = $1, otp_timestamp = $2 WHERE email = $3",
      [otp, timestamp, email]
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error; // Propagate error for upstream handling
  }
});
