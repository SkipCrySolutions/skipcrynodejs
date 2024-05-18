const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  Code: String,
  Name: String,
  Description: String,
  MRP: Number,
  Age: String,
  AgeType: String,
  Brand: String,
  Category: String,
  Quantity: Number,
  Class: String,
  rent30: Number,
  rent15: Number,
  bigSize: Boolean,
  visible: Boolean,
  ShopQty: Number,
  Link: String,
  Untraceable: Boolean,
  NewArrival: Boolean,
  Brand: String,
  Franchise: Boolean,
  StoreId: String,
  Remarks: String,
  VideoOnInsta: Boolean,
  SearchKey: String,
});

const Product = mongoose.model("Product", ProductsSchema, "products");

module.exports = Product;
