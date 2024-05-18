const express = require("express");
const Wishlist = require("../models/wishlist");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find();
    res.json(wishlistItems);
  } catch (err) {
    console.error("Error fetching wishlist items:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const wishlistItems = await Wishlist.find({ customerId });
    const items = {
      customerId,
      products: [],
    };
    wishlistItems.forEach((wishlistItem) => {
      items.products = [
        ...items.products,
        { ...wishlistItem.product, wishlistId: wishlistItem._id },
      ];
    });
    console.log("items => ", items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching wishlist items:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { customerId, product } = req.body;
    const wishlistItem = new Wishlist({
      customerId,
      product,
    });
    const result = await wishlistItem.save();
    res.json({ success: true, result });
  } catch (err) {
    console.error("Error saving wishlist:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Wishlist.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting wishlist item:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
