const express = require("express");
const Product = require("../models/product");
const ProductQty = require("../models/productQty");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const productsByStore = await getProductsByStoreAndParentStore(
      req.query.store,
      req.query.parentStore
    );
    // const toys_list = await Product.find({ StoreId: "CHNPER1" });
    console.log("toys length", productsByStore.length);
    res.json(productsByStore);
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

router.post("/filter", async (req, res) => {
  try {
    const { age, category, brand, price } = req.body;
    let query = {};

    if (age && age.length > 0) {
      query.AgeType = { $in: age };
    }

    if (category && category.length > 0) {
      query.Category = { $in: category };
    }

    if (brand && brand.length > 0) {
      query.Brand = { $in: brand };
    }

    if (price && price.length > 0) {
      const priceRange = price[0].split("-").map(Number);
      query.rent30 = { $gte: priceRange[0], $lte: priceRange[1] };
    }
    const productsByStore = await getProductsByStoreAndParentStore(
      req.query.store,
      req.query.parentStore
    );
    const filteredProducts = productsByStore.filter((product) => {
      for (let key in query) {
        if (query[key].$in && !query[key].$in.includes(product[key])) {
          return false;
        }
        if (query[key].$gte && product[key] < query[key].$gte) {
          return false;
        }
        if (query[key].$lte && product[key] > query[key].$lte) {
          return false;
        }
      }
      return true;
    });
    console.log("productsByStore => ", productsByStore.lenghth);
    console.log("query => ", query);
    // const filteredProducts = await Product.find(query);
    console.log("filteredProducts => ", filteredProducts.length);
    res.json(filteredProducts);
  } catch (err) {
    console.error("Error fetching filtered products:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/byAge", async (req, res) => {
  try {
    console.log("query req => ", req.query);
    let query = null;
    const productsByStore = await getProductsByStoreAndParentStore(
      req.query.store,
      req.query.parentStore
    );
    const toys_list1 = productsByStore.filter((product) => {
      // if (product.visible) {
      if (req.query && req.query.ageType === "preschool") {
        return (
          product.Age === "0+" || product.Age === "1+" || product.Age === "2+"
        );
      } else if (req.query && req.query.ageType === "playschool") {
        return (
          product.Age === "3+" || product.Age === "4+" || product.Age === "5+"
        );
      } else if (req.query && req.query.ageType === "primaryschool") {
        return (
          product.Age === "6+" || product.Age === "7+" || product.Age === "8+"
        );
      }
      // }
    });
    console.log("query => ", query);
    // const toys_list = await productsByStore.find(query);
    console.log("toys_list => ", toys_list1);
    res.json(toys_list1);
  } catch (err) {
    console.error("Error fetching products by age:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/byCategory/:category", async (req, res) => {
  try {
    const category = req.params.category;
    console.log("category => ", category);
    const productsByStore = await getProductsByStore(req.query.store);
    console.log("pro => ", productsByStore);
    const toys_list1 = productsByStore.filter(
      (product) => product.Category === category
    );
    // const toys_list = await Product.find({ Category: category });
    console.log("toys_list => ", toys_list1);
    res.json(toys_list1);
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).send("Internal Server Error");
  }
});

const MEMBERSHIP_TYPES = ["Silver", "Gold", "Platinum"];

router.get("/byMembershipType", async (req, res) => {
  try {
    const membershipType = req.query.membershipType;
    console.log("membershipType => ", membershipType);

    if (!MEMBERSHIP_TYPES.includes(membershipType)) {
      throw new Error("Invalid membership type : " + membershipType);
    }

    const productsByStore = await getProductsByStore(req.query.store);
    const toys_list1 = productsByStore.filter(
      (product) => product.membershipType === membershipType
    );
    res.json(toys_list1);
  } catch (err) {
    console.error("Error fetching products by membershipType:", err);
    res.status(500).send(err.message ?? "Internal Server Error");
  }
});

router.get("/search", async (req, res) => {
  try {
    const { searchKey, store, parentStore } = req.query;
    console.log("searchKey => ", searchKey);
    const productsByStore = await getProductsByStoreAndParentStore(
      store,
      parentStore
    );
    console.log("pro => ", productsByStore);
    const regex = new RegExp(searchKey, "i");
    const toys_list1 = productsByStore.filter((product) =>
      regex.test(product.SearchKey)
    );
    console.log("search toys list => ", toys_list1);
    res.json(toys_list1);
  } catch (err) {
    console.error("Error fetching products with search query:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/store/:storeId/:id/:code", async (req, res) => {
  try {
    const productId = req.params.id;
    const code = req.params.code;
    const store = req.params.storeId;
    console.log("code", productId, store);
    const product = await Product.findById(productId);
    console.log("product found ", product);
    const productExtn = await getQtyProductByStore(store, code);
    const updatedProduct = { ...product._doc, ...productExtn };
    console.log("product after extn found ", updatedProduct);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// check availability in mother store
router.get("/checkAndGet/:code/store/:storeId", async (req, res) => {
  try {
    const code = req.params.code;
    const store = req.params.storeId;
    console.log("code", code, store);
    const productsByStore = await getProductsByStore(store);
    console.log("productsByStore => ", productsByStore);
    const product = productsByStore.find(
      (product) => product.Code === code && product.ShopQty > 0
    );
    // const product = await Product.findOne({ Code: code });
    console.log("product found with availabilty ", product);
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

async function getProductsByStoreAndParentStore(storeId, parentStoreId, query) {
  let finalList = [];
  console.log("storeId => ", storeId);
  console.log("parentStoreId => ", parentStoreId);
  if (storeId === parentStoreId) {
    finalList = await getProductsByStore(storeId, query);
    console.log("finalList => ", finalList.length);
  } else {
    const productsByStore = await getProductsByStore(storeId);
    console.log("productsByStore => ", productsByStore.length);
    const parentStoreProducts = await getProductsByStore(parentStoreId);
    console.log("parentStoreProducts => ", parentStoreProducts.length);
    const parentStoreProductsNotInCurrentStore = parentStoreProducts.filter(
      (parentProduct) =>
        !productsByStore.find((product) => product.Code === parentProduct.Code)
    );
    console.log(
      "parentStoreProductsNotInCurrentStore => ",
      parentStoreProductsNotInCurrentStore.length
    );
    finalList = [...productsByStore, ...parentStoreProductsNotInCurrentStore];
  }
  console.log("finalList => ", finalList.length);
  // Remove duplicates by Code and prioritize PreferenceNumber
  const uniqueProducts = finalList.reduce((acc, product) => {
    const existingProduct = acc.find((p) => p.Code === product.Code);
    if (existingProduct) {
      if (product.PreferenceNumber < existingProduct.PreferenceNumber) {
        acc = acc.filter((p) => p.Code !== product.Code);
        acc.push(product);
      }
    } else {
      acc.push(product);
    }
    return acc;
  }, []);
  finalList = uniqueProducts;
  return finalList;
}

async function getProductsByStore(storeId, query) {
  console.log("storeId => ", storeId, query);
  try {
    const result = await ProductQty.aggregate([
      { $match: { StoreId: storeId, $or: [{ NextAvailable: "" }] } },
      {
        $lookup: {
          from: "products",
          localField: "ProductCode",
          foreignField: "Code",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: "$productDetails._id",
          StoreId: 1,
          Code: "$productDetails.Code",
          Name: "$productDetails.Name",
          Description: "$productDetails.Description",
          Age: "$productDetails.Age",
          AgeType: "$productDetails.AgeType",
          Brand: "$productDetails.Brand",
          Category: "$productDetails.Category",
          bigSize: "$productDetails.bigSize",
          VideoOnInsta: "$productDetails.VideoOnInsta",
          SearchKey: "$productDetails.SearchKey",
          membershipType: "$productDetails.Membership Type",
          NextAvailable: "$NextAvailable",
          QtyCode: "$QtyCode",
          PreferenceNumber: "$PreferenceNumber",
        },
      },
    ]);
    console.log("result => ", result.length);
    return result;
  } catch (error) {
    console.error("Error fetching products by store:", error);
  }
}

async function getQtyProductByStore(storeId, productCode) {
  try {
    const qtyResult = await ProductQty.find({
      StoreId: storeId,
      ProductCode: productCode,
    });
    console.log("qtyResult => ", qtyResult);
    const onlyAvailable = qtyResult.filter((qty) => qty.NextAvailable === "");
    console.log("onlyAvailable => ", onlyAvailable);
    const highPreferenceQty = onlyAvailable.reduce((min, qty) => {
      return qty.PreferenceNumber < min.PreferenceNumber ? qty : min;
    }, onlyAvailable[0]);
    console.log("highPreferenceQty => ", highPreferenceQty);
    const productExtn = {
      Quantity: qtyResult.length,
      ShopQty: onlyAvailable.length,
      TimesRented: qtyResult.reduce((acc, qty) => acc + qty.TimesRented, 0),
      quantities: qtyResult,
      mrp: qtyResult.reduce((max, qty) => {
        return qty.Mrp > max ? qty.Mrp : max;
      }, 0),
      rent30:
        onlyAvailable.reduce((max, qty) => {
          return qty.Rent30 > max ? qty.Rent30 : max;
        }, 0) || 200,
      // TODO: remove hardcoding
      prefQtyCode: highPreferenceQty?.QtyCode,
      StoreId: storeId,
    };
    console.log("getQtyByStoreAndProduct => ", productExtn);
    return productExtn;
  } catch (error) {
    console.error("Error fetching product qty by store and product:", error);
  }
}
