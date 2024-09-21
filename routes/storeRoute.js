const express = require("express");
const Store = require("../models/store");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const store_list = await Store.find();
    console.log("store length", store_list.length);
    res.json(store_list);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const store = await Store.find({ StoreId: id });
    console.log("get store => ", store);
    res.json(store[0]);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("edit => ", id, req.body);
    const updatedStore = req.body;
    await Store.findByIdAndUpdate(id, updatedStore);
    res.json({ success: true });
  } catch (err) {
    console.error("Error editing store:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
