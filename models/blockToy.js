const mongoose = require("mongoose");

const blockToySchema = new mongoose.Schema({
  customerId: String,
  product: mongoose.Schema.Types.Mixed,
  blockAmount: Number,
  blockDate: String
});

const BlockToy = mongoose.model("BlockToy", blockToySchema);

module.exports = BlockToy;

