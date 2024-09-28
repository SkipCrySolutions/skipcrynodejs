const mongoose = require("mongoose");

const StoreProductsMapSchema = new mongoose.Schema({
  StoreId: String,
  Code: String,
  Quantity: Number,
  visible: Boolean,
  ShopQty: Number,
  NewArrival: Boolean,
  TimesRented: Number,
  Remarks: String,
  NextAvailableBy: String
});

const StoreProductMap = mongoose.model(
  "StoreProductMap",
  StoreProductsMapSchema,
  "storeProductMap"
);

module.exports = StoreProductMap;

// TODO: Remove this model
