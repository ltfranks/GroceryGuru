// src/pages/recipe.ts
import renderPage from "./renderPage";
// @ts-ignore
import { css, html } from "@calpoly/mustang/server";
import { Recipe } from "../models/recipe"; // Ensure this is your Recipe model

export class RecipePage {
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
                        src="/api/recipes/${this.data.id}"
                        mode="view">
                    </recipe-card>
                </main>
            </body>
        `;
    }
}
