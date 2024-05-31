const express = require("express");
const Cart = require("../models/cart");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    Cart.find().then((result) => {
      res.json(result);
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getCart/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const cart = await Cart.find({ CustomerId: customerId });
    res.json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/addCart", async (req, res) => {
  try {
    const { CustomerId, Product, rentedDays, rentedAmount } = req.body;
    const cartItem = new Cart({
      CustomerId,
      Product,
      rentedDays,
      rentedAmount,
    });
    const user = (await User.find({ CustomerId }))[0];
    user.cartCount += 1;
    console.log("dfgh user => ", user);
    // TODO: fix and uncomment
    // await user.save();
    await cartItem.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving cart:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/removecartItem/:customerId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const CustomerId = req.params.customerId;
    console.log(id);
    await Cart.findByIdAndDelete(id);
    const user = await User.findOne({ CustomerId });
    if (user.cartCount !== 0) {
      user.cartCount -= 1;
      await user.save();
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/clearCart/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    await Cart.deleteMany({ CustomerId: customerId });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting cart:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
