const mongoose = require("mongoose");

const ToyWalletSchema = new mongoose.Schema({
  customerId: String,
  totalAmount: Number,
  amountFromRewards: Number,
  amountFromGiftCards: Number,
  amountByAddingToWallet: Number,
  amountFromReferrals: Number,
});

const ToyWallet = mongoose.model("ToyWallet", ToyWalletSchema, "toyWallet");

module.exports = ToyWallet;
