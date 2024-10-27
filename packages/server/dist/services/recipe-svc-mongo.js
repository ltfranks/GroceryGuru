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
var recipe_svc_mongo_exports = {};
__export(recipe_svc_mongo_exports, {
  default: () => recipe_svc_mongo_default
});
module.exports = __toCommonJS(recipe_svc_mongo_exports);
var import_mongoose = require("mongoose");
const IngredientSchema = new import_mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
});
const RecipeSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    servings: { type: String, required: true },
    prepTime: { type: String, required: true },
    ingredients: { type: [IngredientSchema], required: true },
    instructions: { type: [String], required: true },
    notes: { type: String }
    // Optional field
  },
  { collection: "recipes" }
);
const RecipeModel = (0, import_mongoose.model)("Profile", RecipeSchema);
function index() {
  return RecipeModel.find();
}
function get(id) {
  return RecipeModel.findOne({ id }).then((recipe) => {
    if (!recipe) throw new Error(`Recipe with id ${id} not found`);
    return recipe;
  }).catch((err) => {
    throw new Error(`Error fetching recipe: ${err}`);
  });
}
var recipe_svc_mongo_default = { index, get };
