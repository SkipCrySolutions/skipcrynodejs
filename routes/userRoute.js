const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateSession = require("../middleware/authenticateSession");
const generateAndCheckNumber = require("../utils/generateCustomerCode");
const Session = require("../models/session");
const ToyWallet = require("../models/toyWallet");
const generateReferralCode = require("../utils/generateCustomerReferralCode");

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


router.get("/get/:customerId", async (req, res) => {
  try {
    const id = req.params.customerId;
    const user = await User.find({ CustomerId: id });
    console.log("get user => ", user);
    res.json(user[0]);
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

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

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

     // Hash the password before saving it
     const saltRounds = 10;  // Number of salt rounds for bcrypt
     const hashedPassword = await bcrypt.hash(req.body.Password, saltRounds);  // Hash the password
 
    const user = new User({
      ...req.body,
      Password: hashedPassword, 
      CustomerId: `SCM${code}`,
      Status: "New",
    });
    console.log("user => ", user);
    const { Mobile, Name, referralCodeForSignup } = req.body;
    const referralCode = await generateReferralCode(code, Name);
    const userMobile = await User.findOne({ Mobile: Mobile });
    if (userMobile) {
      res.status(409).json({
        error: "User already exists with given phone number. Please login",
      });
    } else {
      user.referralCode = referralCode;
      console.log("user => ", user);
      await user.save();
      const referredBy = await validateReferralCode(referralCodeForSignup);
      const toyWallet = new ToyWallet({
        customerId: user.CustomerId,
        totalAmount: referredBy ? 200 : 100,
        amountFromRewards: referredBy ? 200 : 100,
        amountFromGiftCards: 0,
        amountByAddingToWallet: 0,
        amountFromReferrals: 0,
      });
      await toyWallet.save();
      res.json(user);
    }
  } catch (error) {
    console.error("Error creating a new user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

async function validateReferralCode(referralCode) {
  console.log(referralCode);
  const referredUser = await User.findOne({ referralCode });
  if (referredUser) {
    const toyWallet = await ToyWallet.findOne({
      customerId: referredUser.CustomerId,
    });
    console.log('referredUser => ', referredUser);
    console.log('toywallet => ', toyWallet);
    toyWallet.totalAmount += 200;
    toyWallet.amountFromReferrals += 200;
    await toyWallet.save();
  }
  return referredUser;
}
