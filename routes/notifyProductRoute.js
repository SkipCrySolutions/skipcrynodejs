const express = require("express");
const NotifyProduct = require("../models/notifyProduct");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notifyProducts = await NotifyProduct.find();
    res.json(notifyProducts);
  } catch (err) {
    console.error("Error fetching notify products:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const notifyProducts = await NotifyProduct.find({
      customerId,
      nextAvailable: { $gte: sixtyDaysAgo },
    }).exec();
    console.log("notifyProducts => ", notifyProducts);
    res.json(notifyProducts);
  } catch (err) {
    console.error("Error fetching notify products:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { customerId, productId, storeId, nextAvailable } = req.body;
    const notifyProduct = new NotifyProduct({
      customerId,
      productId,
      storeId,
      nextAvailable,
    });
    const result = await notifyProduct.save();
    res.json({ success: true, result });
  } catch (err) {
    console.error("Error saving notify product:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
