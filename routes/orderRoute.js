const express = require("express");
const Order = require("../models/order");
const StoreProductMap = require("../models/storeProductMap");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    Order.find().then((result) => {
      res.json(result);
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Customer current order
router.get("/hold/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await Order.find({ customerId: customerId })
      .sort({ _id: -1 })
      .exec();
    console.log(orders);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching customer orders:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/changeState/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    let newState = "";
    if (order.Status === "Placed") {
      newState = "Accepted";
    } else if (order.Status === "Accepted") {
      newState = "Packed";
    } else if (order.Status === "Packed") {
      newState = "OnTheWay";
    } else if (order.Status === "OnTheWay") {
      newState = "Delivered";
    } else if (order.Status === "Delivered") {
      newState = "ReturnTime";
    } else if (order.Status === "ReturnTime") {
      newState = "Returned";
    } else if (order.Status === "Returned") {
      newState = "ToyChecked";
    } else if (order.Status === "ToyChecked") {
      newState = "Closed";
    }
    console.log("new State => ", newState);
    await order.updateOne({ Status: newState });
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating customer order state:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/order", async (req, res) => {
  try {
    console.log("rr => ", req.body);
    const { storeId, products, ...remaining } = req.body;
    console.log("remainign => ", remaining);
    // order placed for customer - irrespective of different stores
    const order = await placeOrder(products, remaining, storeId, storeId);
    const motherStoreProducts = getProductsByMotherStore(products, storeId);
    console.log("motherStoreProducts => ", motherStoreProducts);
    if (motherStoreProducts.length > 0) {
      const order = await placeOrderForMotherStore(
        motherStoreProducts,
        remaining,
        "CHNPER1",
        storeId
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

function getProductsByMotherStore(products, storeId) {
  return products.filter((productEntity) => {
    const product = productEntity.product;
    if (product.StoreId !== storeId) {
      return product;
    }
  });
}

function getRentForProducts(products) {
  let rent = 0;
  products.forEach((productEntity) => {
    rent += productEntity.rentedAmount;
  });
}

async function placeOrder(products, remaining, storeId, mainStoreId) {
  const {
    customerId,
    Status,
    orderDate,
    orderTotal,
    isNewCustomer,
    addonDeposit,
  } = remaining;
  let order = null;
  if (storeId === mainStoreId) {
    order = new Order({
      customerId,
      products,
      Status,
      orderDate,
      orderTotal,
      AddonDeposit: addonDeposit,
      storeId,
    });
  }
  console.log("order ===>>>> ", order);
  const productsUpdated = await updateProductsCount(products);
  const order1 = await order.save();
  console.log("order1 => ", order1);
  const userUpdated = await getUserAndUpdate(customerId, isNewCustomer);
}

async function placeOrderForMotherStore(
  products,
  remaining,
  storeId,
  mainStoreId
) {
  const { Status, orderDate } = remaining;
  let order = null;
  if (storeId !== mainStoreId) {
    order = new Order({
      customerId: mainStoreId,
      products,
      Status,
      orderDate,
      orderTotal: getRentForProducts(products),
      AddonDeposit: 0,
      storeId,
    });
    console.log("order ===>>>> ", order);
    const order1 = await order.save();
  }
}

async function updateProductsCount(products) {
  for (const product1 of products) {
    try {
      console.log("product1 => ", product1, product1.return);
      const prod = product1.product;
      console.log("Fetching product with code:", prod.Code);

      const product = await StoreProductMap.findOne({ Code: prod.Code });

      if (product) {
        console.log("Fetched product => ", product);
        product.NextAvailableBy = addDays(product1.return, 3);

        if (product.ShopQty && product.ShopQty > 0) {
          console.log("here", product, product.ShopQty);
          product.ShopQty -= 1;
          await product.save();
          console.log(
            "Product quantity reduced successfully. Updated product:",
            product
          );
        } else {
          console.error("Error: ShopQty is already 0 for product:", product);
        }
      } else {
        console.error("Error: Document not found for code:", prod.Code);
      }
    } catch (error) {
      console.error("Error fetching or updating product:", error);
    }
  }
}

async function getUserAndUpdate(customerId, isNewCustomer) {
  const user = await User.findOne({ CustomerId: customerId });
  console.log("user => ", user);
  user.cartCount = 0;
  if (isNewCustomer) {
    user.DepositAmount = user.outsideDeliveryZone ? 2000 : 1500;
    user.Status = "Active";
  }
  await user.save();
}

function addDays(dateString, days) {
  // Parse the date string into a Date object
  let date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Add the specified number of days
  date.setDate(date.getDate() + days);

  // Convert the date back to a string (ISO format: YYYY-MM-DDTHH:MM:SS.sssZ)
  // You can adjust the format as needed
  return date.toISOString().split("T")[0];
}
