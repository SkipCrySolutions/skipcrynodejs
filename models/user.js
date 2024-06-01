const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  RegisterDay: { type: Number },
  CustomerId: { type: String, required: true },
  Mobile: { type: Number, required: true },
  Maps_Link: { type: String },
  Name: { type: String, required: true },
  City: { type: String, required: true },
  Location: { type: String },
  ValidDate: { type: String },
  Address: { type: String },
  Password: { type: String, required: true },
  cartCount: { type: Number, default: 0 },
  KmDistance: Number,
  Status: String, // New, Active, Paused, Closed
  RewardsCount: Number,
  DepositAmount: Number,
  SessionId: String,
  KidDob: String,
  Pincode: { type: Number, required: true },
  DueDay: Number,
  lastOrderClosed: Boolean,
  fineAmount: Number,
  paymentDone: Boolean,
  outsideDeliveryZone: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
