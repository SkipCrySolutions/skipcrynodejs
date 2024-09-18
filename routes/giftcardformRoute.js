// const express = require("express");
// const GiftCard = require("../models/giftcard");

// const router = express.Router();

// // Get all gift cards
// router.get("/", async (req, res) => {
//   try {
//     const giftCards = await GiftCard.find();
//     res.json(giftCards);
//   } catch (err) {
//     console.error("Error fetching gift cards:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Get gift cards by receiver email
// router.get("/getGiftCards/:receiverEmail", async (req, res) => {
//   try {
//     const receiverEmail = req.params.receiverEmail;
//     const giftCards = await GiftCard.find({ reciever_mail: receiverEmail });
//     res.json(giftCards);
//   } catch (err) {
//     console.error("Error fetching gift cards:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Add a new gift card
// router.post("/addGiftCard", async (req, res) => {
//   try {
//     const { sender, reciever, reciever_mail, reciever_mobile, message, amount, quantity } = req.body;
//     const giftCard = new GiftCard({
//       sender,
//       reciever,
//       reciever_mail,
//       reciever_mobile,
//       message,
//       amount,
//       quantity,
//     });
//     await giftCard.save();
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Error saving gift card:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Delete a gift card by ID
// router.delete("/removeGiftCard/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     await GiftCard.findByIdAndDelete(id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Error deleting gift card:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Clear all gift cards for a specific receiver email
// router.delete("/clearGiftCards/:receiverEmail", async (req, res) => {
//   try {
//     const receiverEmail = req.params.receiverEmail;
//     await GiftCard.deleteMany({ reciever_mail: receiverEmail });
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Error deleting gift cards:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const GiftCard = require('../models/giftcardform');

// Create a new gift card
router.post('/giftcards', (req, res) => {
  const giftCard = new GiftCard(req.body);
  giftCard.save((err, giftCard) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(giftCard);
    }
  });
});

// Get all gift cards
router.get('/giftcards', (req, res) => {
  GiftCard.find().then(giftCards => {
    res.send(giftCards);
  }).catch(err => {
    res.status(400).send(err);
  });
});

module.exports = router;