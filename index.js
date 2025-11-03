const express = require("express");
const app = express();
const port = 3000;

// ----------------------------
require("dotenv").config(); // Load .env variables first
const express = require("express");
const helmet = require("helmet"); // Secures HTTP headers
const cors = require("cors"); // Manages Cross-Origin Resource Sharing
const rateLimit = require("express-rate-limit"); // Prevents brute-force attacks

// --------------------------------------------------------------------------------
// --- Core Middleware ---
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Set secure headers
// ----------------------------==========================================================
// --- CORS Configuration ---
// Only allow your Next.js frontend to make requests
const corsOptions = {
  origin: "http://localhost:3000", // Your Next.js app URL
};
app.use(cors(corsOptions));

// --- Rate Limiting ---
// Apply to auth routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 requests per 15-minute window
  message: "Too many login attempts, please try again after 15 minutes",
});
// ----------------------------==========================================================
// ----------------------------==========================================================
// app.use("/api/auth/login", authLimiter);
// app.use("/api/auth/register", authLimiter);
// ----------------------------==========================================================
// ----------------------------==========================================================
// --- Routes ---
// Import your route files
// const authRoutes = require("./routes/authRoutes");
// const protectedRoutes = require("./routes/protectedRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/data", protectedRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
