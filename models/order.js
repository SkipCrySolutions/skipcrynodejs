const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  originalCustomerId: String,
  customerId: String,
  storeId: String,
  products: mongoose.Schema.Types.Mixed,
  Status: String,
  orderDate: String,
  toysTotal: Number,
  deliveryTotal: Number,
  orderTotal: Number,
  deductFromWallet: Number,
  amountToPay: Number,
  AddonDeposit: Number,
  orderId: String,
  statusChangeDate: String,
  productQtyCode: String,
  isExtend: Boolean,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// States of an order
// Placed, Accepted, Delivery Planned, Delivered, Pickup Planned, Returned
