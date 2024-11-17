// http://localhost:3000/recipe/pancakes_001
// src/pages/recipe.ts
import renderPage from "./renderPage";
// @ts-ignore
import { css, html } from "@calpoly/mustang/server";
import { Recipe, Ingredient } from "../models/recipe"; // Import the Recipe and Ingredient models

export class Recipe {
    data: Recipe;

    constructor(data: Recipe) {
        this.data = data;
    }

    render() {
        return renderPage({
            body: this.renderBody(),
            stylesheets: ["/styles/recipe_layout.css"],
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

        return html`
            <body>
            <main class="recipe-page">
                <recipe-card
                        src="/api/recipes/pancakes_001"
                    <!-- Content inside the slots can be removed or commented out -->
                </recipe-card>
            </main>
            </body>
        `;
    }
}
