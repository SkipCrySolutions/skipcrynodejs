const express = require("express");
const router = express.Router();
const usersRoutes = require("./routes/userRoute");
const productsRoutes = require("./routes/productRoute");
const ordersRoutes = require("./routes/orderRoute");
const cartRoutes = require("./routes/cartRoute");
const wishlistRoutes = require("./routes/wishlistRoute");
const connectToMongoDB = require("./config");

router.get("/api", async (req, res) => {
  // root connection
  res.json({ message: "Hello from Node.js API!" });
  connectToMongoDB();
});

router.use("/api/users", usersRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/orders", ordersRoutes);
router.use("/api/cart", cartRoutes);
router.use("/api/wishlist", wishlistRoutes);

module.exports = router;
