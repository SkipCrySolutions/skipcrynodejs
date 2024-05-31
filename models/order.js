const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  customerId: String,
  products: mongoose.Schema.Types.Mixed,
  Status: String,
  orderDate: String,
  orderTotal: Number,
  AddonDeposit: Number
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// States of an order
// Placed, Accepted, Delivery Planned, Delivered, Pickup Planned, Returned
