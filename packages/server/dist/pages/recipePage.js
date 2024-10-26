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
var recipePage_exports = {};
__export(recipePage_exports, {
  RecipePage: () => RecipePage
});
module.exports = __toCommonJS(recipePage_exports);
var import_renderPage = __toESM(require("./renderPage"));
var import_server = require("@calpoly/mustang/server");
class RecipePage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/recipe_layout.css"],
      styles: [
        import_server.css`
                  .recipe-page {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: var(--color-background);
                    color: var(--color-text);
                  }

                  .recipe-header {
                    text-align: center;
                    color: var(--color-title);
                  }
                `
      ],
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
    const { name, servings, prepTime, ingredients, instructions, notes } = this.data;
    const ingredientList = ingredients.map((ingredient) => this.renderIngredient(ingredient));
    const instructionList = instructions.map((step, index) => this.renderDirection(step, index + 1));
    return import_server.html`
            <body>
            <main class="recipe-page">
                <section class="recipe-header">
                    <h1>${name}</h1>
                    <p>Servings: ${servings}</p>
                    <p>Prep time: ${prepTime}</p>
                </section>
                <section class="recipe-body">
                    <div class="ingredients">
                        <h2>Ingredients</h2>
                        <ul>
                            ${ingredientList}
                        </ul>
                    </div>
                    <div class="instructions">
                        <h2>Instructions</h2>
                        <ol>
                            ${instructionList}
                        </ol>
                    </div>
                </section>
                ${notes ? import_server.html`
                    <section class="recipe-notes">
                        <h3>Notes</h3>
                        <p>${notes}</p>
                    </section>
                ` : ""}
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
  RecipePage
});
