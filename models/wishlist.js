const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  customerId: String,
  product: mongoose.Schema.Types.Mixed
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;

// States of an order
// Placed, Accepted, Delivery Planned, Delivered, Pickup Planned, Returned
