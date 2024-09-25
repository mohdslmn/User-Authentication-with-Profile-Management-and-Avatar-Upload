const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const path = require("path");
const multer = require("multer");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory to save uploaded files
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize Multer
const upload = multer({ storage: storage });

router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    // req.body contains person data
    const data = req.body;

    // If an avatar was uploaded, add the file path to the user data
    if (req.file) {
      data.avatar = req.file.path; 
    }

    // Create a new Person document in the database
    const newUser = new User(data);
    // Save new person in the database
    const savedUser = await newUser.save();
    console.log("Data saved");

    const payload = {
      id: savedUser.id,
      name: savedUser.name,
    };
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is:", token);

    res.status(200).json({ savedUser, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Extract username and password from request body
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email: email });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // generate Token
    const payload = {
      id: user.id,
      name: user.name,
    };
    const token = generateToken(payload);

    // return token as response
    res.json(token);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const data = await User.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("name email avatar"); // Only select the fields you need
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT route to update user data and avatar
router.put("/update/:id", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // Check if an avatar was uploaded
    if (req.file) {
      const avatarPath = req.file.path;
      updatedData.avatar = avatarPath; 
    }

    // Update the user in the database
    const response = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true, 
    });

    // Check if user was found
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(response);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await User.findByIdAndDelete(userId);
    if (!response) {
      return res.status(404).json("User Not Found");
    }
    console.log("Deleted Successfully");
    res.status(200).json("Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
