"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var recipe_exports = {};
__export(recipe_exports, {
  Recipe: () => Recipe
});
module.exports = __toCommonJS(recipe_exports);
var import_renderPage = __toESM(require("./renderPage"));
var import_server = require("@calpoly/mustang/server");
class Recipe {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      scripts: [
        `import { define } from "@calpoly/mustang";
                 import { RecipeCard } from "/scripts/recipe-card.js";

                 define({
                   "recipe-card": RecipeCard
                 });`
      ]
    });
  }
  renderBody() {
    const { name, servings, prepTime } = this.data;
    return import_server.html`
        <body>
        <main class="recipe-page">
            <recipe-card
                src="/api/recipes/pancakes_001"
                title="${name}"
                servings="${servings}"
                prep-time="${prepTime}"
                image-url="/path/to/image.jpg">
                <!-- Content inside the slots can be removed or commented out -->
            </recipe-card>
        </main>
        </body>
    `;
  }
  renderIngredient(ingredient) {
    return import_server.html`
            <li>${ingredient.quantity} ${ingredient.unit} of ${ingredient.itemName}</li>`;
  }
  renderDirection(step, stepNumber) {
    return import_server.html`
            <li>Step ${stepNumber}: ${step}</li>`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Recipe
});
