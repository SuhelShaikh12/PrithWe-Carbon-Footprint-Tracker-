



import express from "express";
import bcrypt from "bcrypt";
import { db } from "./index.js"; // <- Adjust the path if needed
import { sendOTP } from "./SendOTP.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existing = await db.query(
      "SELECT 1 FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password, type, verified)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id`,
      [name, normalizedEmail, hashedPassword, type]
    );

    res.status(201).json({
      message: "Registered successfully. Please verify your email.",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Send OTP route
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.trim().toLowerCase();

    // Check user existence
    const userResult = await db.query(
      "SELECT id, verified FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }

    if (userResult.rows[0].verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await sendOTP(normalizedEmail); // Send OTP and save to DB

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await db.query(
      "SELECT otp, otp_timestamp, id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const { otp: savedOtp, otp_timestamp, id: userId } = result.rows[0];
    const now = Date.now();

    if (!savedOtp || !otp_timestamp) {
      return res.status(400).json({ message: "No OTP requested for this email" });
    }

    if (now - otp_timestamp > 10 * 60 * 1000) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (savedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await db.query(
      "UPDATE users SET verified = true, otp = NULL, otp_timestamp = NULL WHERE id = $1",
      [userId]
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});

export default router;






// import express from "express";
// import bcrypt from "bcrypt";
// import db from "./db.js"; // Adjust if needed

// const router = express.Router();

// // ✅ Register route (no email verification)
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, type } = req.body;

//     if (!name || !email || !password || !type) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     // Check if email already exists
//     const existing = await db.query(
//       "SELECT 1 FROM users WHERE LOWER(email) = $1",
//       [normalizedEmail]
//     );

//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       `INSERT INTO users (name, email, password, type) 
//        VALUES ($1, $2, $3, $4)`,
//       [name, normalizedEmail, hashedPassword, type]
//     );

//     res.status(201).json({
//       message: "Registered successfully. You can now log in.",
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// });

// // ✅ Login route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const result = await db.query(
//       "SELECT * FROM users WHERE LOWER(email) = $1",
//       [normalizedEmail]
//     );

//     if (result.rows.length === 0) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const user = result.rows[0];

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       user: { id: user.id, name: user.name, email: user.email, type: user.type },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });

// export default router;
