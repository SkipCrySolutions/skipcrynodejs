const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticateSession = require("../middleware/authenticateSession");
const generateAndCheckNumber = require("../utils/generateCustomerCode");
const Session = require("../models/session");
const ToyWallet = require("../models/toyWallet");
const generateReferralCode = require("../utils/generateCustomerReferralCode");
const Store = require("../models/store");

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

router.get("/get/:id/:customerId", async (req, res) => {
  try {
    const id = req.params.id;
    const customerCode = req.params.customerId;
    const matchedUsers = await getAccumulatedUserData(customerCode);
    console.log("get user => ", matchedUsers);
    res.json(matchedUsers[0]);
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

    const accumulatedUserData = await getAccumulatedUserData(user.CustomerId);
    console.log("accumulatedUserData => ", accumulatedUserData);

    res.json({ token, ...userWithoutPassword, sessionId: session._id, ...accumulatedUserData[0] });
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
    console.log("referredUser => ", referredUser);
    console.log("toywallet => ", toyWallet);
    toyWallet.totalAmount += 200;
    toyWallet.amountFromReferrals += 200;
    await toyWallet.save();
  }
  return referredUser;
}

async function getAccumulatedUserData(customerId) {
  console.log("customerId => ", customerId);
  try {
    // Perform aggregation to join users with toywallet
    const result = await ToyWallet.aggregate([
      { $match: { customerId: customerId } },
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "CustomerId",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: "$userDetails._id",
          CustomerId: "$userDetails.CustomerId",
          Name: "$userDetails.Name",
          Mobile: "$userDetails.Mobile",
          Email: "$userDetails.Email",
          Status: "$userDetails.Status",
          Address: "$userDetails.Address",
          City: "$userDetails.City",
          Pincode: "$userDetails.Pincode",
          referralCode: "$userDetails.referralCode",
          RegisterDay: "$userDetails.RegisterDay",
          Maps_Link: "$userDetails.Maps_Link",
          DepositAmount: "$userDetails.DepositAmount",
          KmDistance: "$userDetails.KmDistance",
          totalAmount: "$totalAmount",
          amountFromRewards: "$amountFromRewards",
          amountFromGiftCards: "$amountFromGiftCards",
          amountByAddingToWallet: "$amountByAddingToWallet",
          amountFromReferrals: "$amountFromReferrals",
          StoreId: "$userDetails.StoreId",
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Error fetching users by customer id:", error);
  }
}
