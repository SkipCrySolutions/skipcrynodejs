const mongoose = require("mongoose");

const NotifyProductMapSchema = new mongoose.Schema({
  storeId: String,
  productId: String,
  customerId: String,
  nextAvailable: String,
});

const NotifyProduct = mongoose.model(
  "NotifyProduct",
  NotifyProductMapSchema,
  "notifyProduct"
);

module.exports = NotifyProduct;
