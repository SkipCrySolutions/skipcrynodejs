const express = require("express");
const router = express.Router();
const usersRoutes = require("./routes/userRoute");
const productsRoutes = require("./routes/productRoute");
const productQtyRoutes = require("./routes/productQtyRoute");
const ordersRoutes = require("./routes/orderRoute");
const cartRoutes = require("./routes/cartRoute");
const wishlistRoutes = require("./routes/wishlistRoute");
const storeRoutes = require("./routes/storeRoute");
const notifyProductRoutes = require("./routes/notifyProductRoute");
const toyWalletRoutes = require("./routes/toyWalletRoute");
const blockToyRoutes = require("./routes/blockToyRoute");
const connectToMongoDB = require("./config");
const giftcardformRoutes=require("./routes/giftcardformRoute");

router.get("/api", async (req, res) => {
  // root connection
  res.json({ message: "Hello from Node.js API!" });
  connectToMongoDB();
});

router.use("/api/users", usersRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/productQty", productQtyRoutes);
router.use("/api/orders", ordersRoutes);
router.use("/api/cart", cartRoutes);
router.use("/api/wishlist", wishlistRoutes);
router.use("/api/stores", storeRoutes);
router.use("/api/notifyProduct", notifyProductRoutes);
router.use("/api/toyWallet", toyWalletRoutes);
router.use("/api/blockToy", blockToyRoutes);
router.use("/api/giftcard_form",giftcardformRoutes);

module.exports = router;
