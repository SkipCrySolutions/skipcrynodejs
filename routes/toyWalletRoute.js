const express = require("express");
const NotifyProduct = require("../models/notifyProduct");
const ToyWallet = require("../models/toyWallet");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notifyProducts = await ToyWallet.find();
    res.json(notifyProducts);
  } catch (err) {
    console.error("Error fetching notify products:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const toyWallet = await ToyWallet.findOne({
      customerId,
    });
    console.log("toyWallet => ", toyWallet);
    res.json(toyWallet);
  } catch (err) {
    console.error("Error fetching toyWallet:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/addAmountFromMoney/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { amount } = req.body;
    const toyWallet = await ToyWallet.findOne({
      customerId,
    });
    console.log("toyWallet => ", toyWallet);
    toyWallet.amountByAddingToWallet += amount;
    toyWallet.totalAmount += amount;
    toyWallet.save();
    res.json({ success: true, toyWallet });
  } catch (err) {
    console.error("Error fetching toyWallet:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
