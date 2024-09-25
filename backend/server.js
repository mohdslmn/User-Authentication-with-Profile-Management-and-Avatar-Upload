const express = require("express");
const db = require("./db");
const User = require("./models/User");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const passport = require("./auth");
const { jwtAuthMiddleware, generateToken } = require("./jwt");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Define the uploads directory
const uploadsDir = path.join(__dirname, "uploads");

// Check if the uploads directory exists, if not, create it
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created:", uploadsDir);
}

// Serve static files
app.use("/uploads", express.static(uploadsDir));

// Middleware Function

const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`
  );
  next(); 
};
app.use(logRequest);

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate("local", { session: false });
app.use("/api", userRoutes);

app.get("/", function (req, res) {
  res.send("Welcome to our Salman Server");
});


app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
