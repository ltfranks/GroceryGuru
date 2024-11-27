// @ts-ignore
import { Auth, Observer } from "@calpoly/mustang";
// @ts-ignore
import { css, html, LitElement } from "lit";
// @ts-ignore
import { state, property } from "lit/decorators.js";

// @ts-ignore
import { Ingredient, Recipe } from "./models/recipe"; // Import models


export class RecipeViewElement extends LitElement {
    @property({ type: String })
    itemId: string = "";

    @state()
    recipe: Recipe | null = null;

    connectedCallback() {
        super.connectedCallback();
        console.log("ConnectedCallback -> Item ID:", this.itemId);
        if (this.itemId) {
            this.hydrate();
        } else {
            console.error("Missing itemId for recipe.");
        }
    }

    hydrate() {
        console.log("Fetching recipe with ID:", this.itemId);
        fetch(`/api/recipes/${this.itemId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Error fetching recipe: ${response.statusText}`);
            })
            .then((data: Recipe) => {
                // Make sure the data structure matches
                this.recipe = {
                    ...data,
                    ingredients: data.ingredients || [],
                    instructions: data.instructions || [],
                };
            })
            .catch((error) => {
                console.error("Failed to fetch recipe:", error);
            });
    }

    render() {
        if (!this.recipe) {
            return html`<p>Loading recipe...</p>`;
        }

        const { name, servings, prepTime, ingredients, instructions, notes } = this.recipe;
        return html`
      <main>
        <section class="recipe-section">
          <h2>${name}</h2>
          <p>Store: ${this.recipe.store}</p>
          <p>Servings: ${servings}</p>
          <p>Prep Time: ${prepTime}</p>

          <div class="ingredients">
            <h3>Ingredients</h3>
            <ul>
              ${ingredients.map((ingredient: Ingredient) => html`
                <li>${ingredient.quantity} ${ingredient.unit} ${ingredient.itemName}</li>
              `)}
            </ul>
          </div>

          <div class="instructions">
            <h3>Instructions</h3>
            <ol>
              ${instructions.map((step: string) => html`<li>${step}</li>`)}
            </ol>
          </div>

          <div class="notes">
            <h3>Notes</h3>
            <p>${notes || "No additional notes"}</p>
          </div>
        </section>
      </main>
    `;
    }

    static styles = css`
      main {
        padding: 20px;
      }

      .recipe-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      h2 {
        font-size: var(--size-type-xxlarge);
        font-family: var(--font-family-header);
        text-align: center;
      }

      .ingredients, .instructions, .notes {
        margin-top: 20px;
      }

      .ingredients ul, .instructions ol {
        padding-left: 20px;
        line-height: 1.6;
      }

      .notes p {
        font-style: italic;
      }
    `;
}
