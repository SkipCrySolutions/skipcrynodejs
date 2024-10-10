const express = require("express");
const ProductQty = require("../models/productQty");
const Product = require("../models/product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const prodQtyList = await getProductsByStore();
    const uniqueProdQtyList = prodQtyList.reduce((acc, current) => {
      const x = acc.find(item => item.ProductCode === current.ProductCode);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    console.log("prodQtyList => ", uniqueProdQtyList.length);

    // const expandedProdQtyList = [];

    // prodQtyList.forEach(item => {
    //   for (let i = 0; i < item.Quantity; i++) {
    //   expandedProdQtyList.push({
    //     ...item,
    //     QtyCode: `${item.ProductCode}Q${i + 1}`,
    //     PreferenceNumber: i + 1,
    //     DateAdded: new Date('01-01-2024').toISOString(),
    //     NextAvailable: item.NextAvailable ? item.NextAvailable : ''
    //   });
    //   }
    // });

    // console.log("expandedProdQtyList => ", expandedProdQtyList.length);
    // res.json(expandedProdQtyList);
    res.json(uniqueProdQtyList);
  } catch (err) {
    console.error("Error fetching prodQtyList:", err);
    res.status(500).send("Internal Server Error");
  }
});

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

async function getProductsByStore() {
  try {
    // Perform an aggregation to merge the product and productQty collections
    const result = await ProductQty.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "ProductCode",
          foreignField: "Code",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 0,
          QtyCode: 1,
          DateAdded: 1,
          Earned: 1,
          Remarks: 1,
          ProductCode: 1,
          NextAvailable: 1,
          StoreId: 1,
          TimesRented: 1,
          Visible: 1,
          New: 1,
          PreferenceNumber: 1,
          Quantity: 1,
          ShopQty: 1,
          BinNumber: 1,
          Rent30: "$product.rent30",
          Mrp: "$product.Mrp",
          Age: "$product.Age",
          Name: "$product.Name",
        },
      },
    ]);
    return result;
  } catch (error) {
    console.error("Error fetching products by store:", error);
  }
}

module.exports = router;
