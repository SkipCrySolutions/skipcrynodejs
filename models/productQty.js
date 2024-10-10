const mongoose = require("mongoose");

const ProductQtySchema = new mongoose.Schema({
  QtyCode: String,
  DateAdded: String,
  Earned: Number,
  Remarks: String,
  ProductCode: String,
  NextAvailable: String,
  StoreId: String,
  TimesRented: Number,
  Mrp: Number,
  Rent30: Number,
  Visible: Boolean,
  New: Boolean,
  PreferenceNumber: Number,
  Quantity: Number,
  ShopQty: Number,
  BinNumber: String,
  Age: String
});

const ProductQty = mongoose.model("ProductQty", ProductQtySchema, "productQuantityMap");

module.exports = ProductQty;
