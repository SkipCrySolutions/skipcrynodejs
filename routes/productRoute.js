const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const toys_list = await Product.find({ visible: true, StoreId: "CHNPER1" });
    console.log("toys length", toys_list.length);
    res.json(toys_list);
  } catch (err) {
    console.error("Error fetching visible products:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/updateAll", async (req, res) => {
  try {
    await Product.updateMany(
      {},
      {
        $set: {
          SearchKey: {
            $concat: [
              "$Name",
              ", ",
              "$Code",
              ", ",
              "$Brand",
              ", ",
              "$Category",
              ", ",
              "$Age",
            ],
          },
        },
      }
    );
    res.json({ success: true });
  } catch (err) {}
});

router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("edit => ", id, req.body);
    const updatedProduct = req.body;
    await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
      upsert: true,
      useFindAndModify: false,
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error editing product:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/hidden", async (req, res) => {
  try {
    const toys_list = await Product.find({ visible: false });
    console.log("toys length", toys_list.length);
    res.json(toys_list);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/byAge", async (req, res) => {
  try {
    console.log("query req => ", req.query);
    let query = null;
    if (req.query && req.query.ageType === "preschool") {
      query = {
        $or: [{ Age: "0+" }, { Age: "1+" }, { Age: "2+" }],
      };
    } else if (req.query && req.query.ageType === "playschool") {
      query = {
        $or: [{ Age: "3+" }, { Age: "4+" }, { Age: "5+" }],
      };
    } else if (req.query && req.query.ageType === "primaryschool") {
      query = { $or: [{ Age: "6+" }, { Age: "8+" }] };
    } else {
      query = null;
    }
    console.log("query => ", query);
    const toys_list = await Product.find(query);
    console.log("toys_list => ", toys_list);
    res.json(toys_list);
  } catch (err) {
    console.error("Error fetching products by age:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/byCategory/:category", async (req, res) => {
  try {
    const category = req.params.category;
    console.log("category => ", category);
    const toys_list = await Product.find({ Category: category });
    console.log("toys_list => ", toys_list);
    res.json(toys_list);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/search", async (req, res) => {
  try {
    const { searchKey } = req.query;
    console.log("searchKey => ", searchKey);
    const regex = new RegExp(searchKey, "i");
    const toys_list = await Product.find({
      SearchKey: regex,
    });
    console.log("search toys list => ", toys_list);
    res.json(toys_list);
  } catch (err) {
    console.error("Error fetching products with search query:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/:code", async (req, res) => {
  try {
    const code = req.params.code;
    console.log("code", code);
    const product = await Product.findOne({ Code: code });
    console.log("product found ", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
