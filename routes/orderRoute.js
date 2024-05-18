const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");

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
    const orders = await Order.find({ customerId: customerId });
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
    const { customerId, products, Status, orderDate, orderTotal } = req.body;
    const order = new Order({
      customerId,
      products,
      Status,
      orderDate,
      orderTotal,
    });
    await order.save();
    products.forEach(async (product1) => {
      console.log("product => ", product1);
      const product = await Product.findOne(product1.Code);
      console.log("get product => ", product);
      product.ShopQty -= 1;
      await product.save();
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
