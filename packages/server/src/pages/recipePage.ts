// http://localhost:3000/recipe/pancakes_001
// src/pages/recipePage.ts
import renderPage from "./renderPage";
// @ts-ignore
import { css, html } from "@calpoly/mustang/server";
import { Recipe, Ingredient } from "../models/recipe_model"; // Import the Recipe and Ingredient models

export class RecipePage {
    data: Recipe;

    constructor(data: Recipe) {
        this.data = data;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["/styles/recipe_layout.css"],
            styles: [
                css`
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
        const ingredientList = ingredients.map(ingredient => this.renderIngredient(ingredient));
        const instructionList = instructions.map((step, index) => this.renderDirection(step, index + 1));

        return html`
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
                ${notes ? html`
                    <section class="recipe-notes">
                        <h3>Notes</h3>
                        <p>${notes}</p>
                    </section>
                ` : ""}
            </main>
            </body>
        `;
    }

    renderIngredient(ingredient: Ingredient) {
        return html`
            <li>${ingredient.quantity} ${ingredient.unit} of ${ingredient.itemName}</li>`;
    }

    renderDirection(step: string, stepNumber: number) {
        return html`
            <li>Step ${stepNumber}: ${step}</li>`;
    }
}
