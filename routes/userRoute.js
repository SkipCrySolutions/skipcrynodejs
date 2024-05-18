const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateSession = require("../middleware/authenticateSession");
const generateAndCheckNumber = require("../utils/generateCustomerCode");
const Session = require("../models/session");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log("users => ", users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    console.log("user => ", user);
    res.json(user);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("edit => ", id, req.body);
    const updatedUser = req.body;
    await User.findByIdAndUpdate(id, updatedUser);
    res.json({ success: true });
  } catch (err) {
    console.error("Error editing product:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    console.log("username => ", username);
    // Find user by username
    const user = await User.findOne({ Mobile: username });

    console.log("user => ", user);
    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log('password => ', password, user.Password);

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: 'Invalid password' });
    // }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key");

    const { Password, ...userWithoutPassword } = user._doc;
    console.log("userWithoutPassword => ", userWithoutPassword);

    // create session
    const session = new Session({ userId: user._id });
    await session.save();

    res.json({ token, ...userWithoutPassword, sessionId: session._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const code = await generateAndCheckNumber();
    const user = new User({
      ...req.body,
      CustomerId: `SCM${code}`,
      Status: "New",
    });
    console.log("user => ", user);
    const { Mobile } = req.body;
    const userMobile = await User.findOne({ Mobile: Mobile });
    if (userMobile) {
      res.status(409).json({ error: "User already exists with given phone number. Please login" });
    } else {
      await user.save();
      res.json(user);
    }
  } catch (error) {
    console.error("Error creating a new user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
