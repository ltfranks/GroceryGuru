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
var recipe_svc_exports = {};
__export(recipe_svc_exports, {
  getRecipe: () => getRecipe
});
module.exports = __toCommonJS(recipe_svc_exports);
const recipes = {
  "pancakes_001": {
    id: "pancakes_001",
    name: "Pancakes",
    servings: "6 servings",
    prepTime: "15 minutes",
    ingredients: [
      { itemName: "All-purpose flour", quantity: 1.5, unit: "cups" },
      { itemName: "Baking powder", quantity: 3.5, unit: "tsp" },
      { itemName: "Salt", quantity: 1, unit: "tsp" },
      { itemName: "White sugar", quantity: 1, unit: "tbsp" },
      { itemName: "Milk", quantity: 1.25, unit: "cups" },
      { itemName: "Egg", quantity: 1, unit: "piece" },
      { itemName: "Melted butter", quantity: 3, unit: "tbsp" },
      { itemName: "Maple syrup", quantity: 1, unit: "serving" }
    ],
    instructions: [
      "In a large bowl, sift together the flour, baking powder, salt, and sugar.",
      "Make a well in the center, and pour in the milk, egg, and melted butter. Mix until smooth.",
      "Heat a lightly oiled griddle or frying pan over medium-high heat.",
      "Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake.",
      "Brown on both sides and serve hot with maple syrup."
    ],
    notes: "For fluffier pancakes, let the batter rest for 10 minutes before cooking."
  }
  // Add additional recipes here as needed
};
function getRecipe(recipeId) {
  return recipes[recipeId] || null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRecipe
});
