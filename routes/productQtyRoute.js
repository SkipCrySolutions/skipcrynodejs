const express = require("express");
const ProductQty = require("../models/productQty");
const router = express.Router();

router.post("/add/:code", async (req, res) => {
  try {
    const productQty = new ProductQty(req.body);
    await productQty.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error adding product qty:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/edit/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("edit => ", id, req.body);
        const updatedProductQty = req.body;
        await ProductQty.findByIdAndUpdate(id, updatedProductQty, {
          new: true,
          upsert: true,
          useFindAndModify: false,
        });
        res.json({ success: true });
    } catch (err) {
      console.error("Error editing product qty:", err);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = router;
