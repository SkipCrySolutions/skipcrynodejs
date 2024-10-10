const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Code: String,
  Name: String,
  Description: String,
  Age: String,
  AgeType: String,
  Brand: String,
  Category: String,
  Link: String,
  Franchise: Boolean,
  SearchKey: String,
  BudgetType: String,
  SuitableForLibrary: Boolean,
  DriveImageLink: String,
});

const Product = mongoose.model("Product", ProductsSchema);

module.exports = Product;
