"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var vendor_svc_mongo_exports = {};
__export(vendor_svc_mongo_exports, {
  default: () => vendor_svc_mongo_default
});
module.exports = __toCommonJS(vendor_svc_mongo_exports);
var import_mongoose = require("mongoose");
const ItemSchema = new import_mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  storeId: { type: String, required: true }
});
const VendorSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
    items: { type: [ItemSchema], required: true }
  },
  { collection: "vendors" }
);
const VendorModel = (0, import_mongoose.model)("Vendor", VendorSchema);
function index() {
  return VendorModel.find();
}
function get(id) {
  return VendorModel.findOne({ id }).then((vendor) => {
    if (!vendor) throw new Error(`Vendor with id ${id} not found`);
    return vendor;
  }).catch((err) => {
    throw new Error(`Error fetching vendor: ${err}`);
  });
}
function create(json) {
  const newVendor = new VendorModel(json);
  return newVendor.save();
}
function update(id, vendor) {
  return VendorModel.findOneAndUpdate({ id }, vendor, {
    new: true
    // Return the updated document
  }).then((updated) => {
    if (!updated) throw new Error(`${id} not updated`);
    return updated;
  });
}
function remove(id) {
  return VendorModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw new Error(`${id} not deleted`);
  });
}
var vendor_svc_mongo_default = { index, get, create, update, remove };
