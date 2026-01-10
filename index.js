const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const mobileProductsData = require("./product/mobiles");
const mobileProducts = mobileProductsData.default || mobileProductsData;

// ----------------------------
require("dotenv").config(); // Load .env variables first
const helmet = require("helmet"); // Secures HTTP headers
// const cors = require("cors"); // Manages Cross-Origin Resource Sharing
const rateLimit = require("express-rate-limit"); // Prevents brute-force attacks
const { userData } = require("./user/userData");

// --------------------------------------------------------------------------------
// --- Core Middleware ---
// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Parse JSON bodies
// app.use(helmet()); // Set secure headers
const sendSuccess = (res, data, message = "Success") => {
  return res.status(200).json({
    success: true,
    message: message,
    data: data,
  });
};
// ----------------------------==========================================================
// --- CORS Configuration ---
// Only allow your Next.js frontend to make requests
// const corsOptions = {
//   origin: "http://localhost:3001", // Your Next.js app URL
// };
// app.use(cors(corsOptions));

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

const alldataArray = [
  { pass: 1, name: "Item 1" },
  { pass: 2, name: "Item 2" },
  { pass: 3, name: "Item 3" },
];

app.get("/", (req, res) => {
  // res.send("Hello World! for " + port);
  res.json({
    msg: "HI to head route",
    data: alldataArray,
  });
});

app.get("/head", (req, res) => {
  res.json({
    msg: "HI to head route",
  });
  // res.send("Hi");
});
app.post("/addData", (req, res) => {
  const name = req.body.name;
  const pass = req.body.pass;
  const data = { name, pass };
  console.log(data);
  alldataArray.push(data);

  res.json({
    msg: "HI to head route",
  });
  // res.send("Hi");
});

// ======================= Mobile ======================================

app.post("/allMobiles", (req, res) => {
  sendSuccess(res, mobileProducts, "Mobiles loaded successfully");
  // res.json({
  //   data: mobileProducts,
  //   msg: "successfully Fetched",
  // });
});

// =============== add Mobile =========================================
app.post("/addMobile", (req, res) => {
  const { name, model, price, available, brand, color } = req.body;
  const newMobile = {
    name,
    model,
    price,
    brand,
    available,
    color,
    id: mobileProducts.length + 1,
  };
  console.log(newMobile);
  const compareLength = (a, b) => a < b;
  const oldLength = mobileProducts.length;
  if (name) mobileProducts.push(newMobile);

  const newLength = mobileProducts.length;

  res.json({
    res: newMobile,
    data: mobileProducts,
    msg: compareLength(oldLength, newLength)
      ? "Added successfully"
      : "Error !! Please check",
  });
});

// ============================ Auth =================================
app.post("/signUp", (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  if (name && email && password) {
    userData.map((item) => {
      if (item.email === email) {
        return res.json({
          msg: "User already exists",
          status: false,
        });
      }
    });
    userData.push(user);
    return res.json({
      msg: "User created successfully",
      status: true,
    });
  }
  return res.json({
    msg: "Please provide all the details",
    status: false,
  });
});

app.get("/login", (req, res) => {
  const { email, password } = req.body;
  const user = userData.find((item) => item.email === email);
  if (user) {
    if (user.password === password) {
      return res.json({
        msg: "Login successful",
        status: true,
      });
    }
    return res.json({
      msg: "Incorrect password",
      status: false,
    });
  }
  return res.json({
    msg: "User not found",
    status: false,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
