const mongoose = require("mongoose");

const StoreProductsMapSchema = new mongoose.Schema({
  _id: String,
  StoreId: String,
  Code: String,
  Quantity: Number,
  visible: Boolean,
  ShopQty: Number,
  NewArrival: Boolean,
  TimesRented: Number,
  Remarks: String,
});

const StoreProductMap = mongoose.model(
  "StoreProductMap",
  StoreProductsMapSchema,
  "storeProductMap"
);

module.exports = StoreProductMap;
