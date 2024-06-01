const mongoose = require("mongoose");

const ToyWalletSchema = new mongoose.Schema({
  customerId: String,
  totalAmount: String,
  amountFromRewards: String,
  amountFromGiftCards: String,
  amountByAddingToWallet: String,
  amountFromReferrals: String,
});

const ToyWallet = mongoose.model("ToyWallet", ToyWalletSchema, "toyWallet");

module.exports = ToyWallet;
