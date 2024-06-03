const express = require("express");
const BlockToy = require("../models/blockToy");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blockToys = await BlockToy.find();
    res.json(blockToys);
  } catch (err) {
    console.error("Error fetching blocked toys:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const blockToys = await BlockToy.find({ customerId });
    // const items = {
    //   customerId,
    //   products: [],
    // };
    // wishlistItems.forEach((wishlistItem) => {
    //   items.products = [
    //     ...items.products,
    //     { ...wishlistItem.product, wishlistId: wishlistItem._id },
    //   ];
    // });
    console.log("blockToys => ", blockToys);
    res.json(blockToys);
  } catch (err) {
    console.error("Error fetching blocked toys items:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { storeId, product, blockAmount, blockDate } = req.body;
    const blockToy = new BlockToy({
      customerId,
      storeId,
      product,
      blockAmount,
      blockDate,
    });
    const result = await blockToy.save();
    res.json({ success: true, result });
  } catch (err) {
    console.error("Error saving blocktoys:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
