const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  _id: String,
  Code: String,
  Name: String,
  Description: String,
  MRP: Number,
  Age: String,
  AgeType: String,
  Brand: String,
  Category: String,
  Class: String,
  rent30: Number,
  rent15: Number,
  bigSize: Boolean,
  Link: String,
  Untraceable: Boolean,
  Franchise: Boolean,
  VideoOnInsta: Boolean,
  SearchKey: String,
});

const Product = mongoose.model("Product", ProductsSchema);

module.exports = Product;
