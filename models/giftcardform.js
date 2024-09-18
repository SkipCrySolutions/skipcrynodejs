// const mongoose = require("mongoose");

// const giftcardSchema = new mongoose.Schema({
//   sender: String,
//   reciever: String,
//   reciever_mail: String,
//   reciever_mobile: String,
//   message:String,
//   date: { type: Date, default: Date.now },
//   amount:Number,
//   quantity:Number,
// });

// const GiftCard = mongoose.model("GiftCard", giftcardSchema);

// module.exports = GiftCard;

const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  receiverMail: {
    type: String,
    required: true
  },
  receiverMobile: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('GiftCard', giftCardSchema);