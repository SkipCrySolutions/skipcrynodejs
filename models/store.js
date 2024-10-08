const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  StoreId: { type: String, required: true },
  Name: { type: String, required: true },
  Address: { type: String, required: true },
  Owner: { type: String, required: true },
  Manager: { type: String, required: true },
  OwnerContact: { type: Number, required: true },
  ManagerContact: { type: Number, required: true },
  MapsLocation: { type: String, required: true },
  Latitude: Number,
  Longitude: Number,
  Pincode: String,
  ParentStoreId: { type: String, required: true },
});

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
