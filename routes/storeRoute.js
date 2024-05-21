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

module.exports = router;
