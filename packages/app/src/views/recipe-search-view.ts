// src/views/recipe-search-view.ts
import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";

export class RecipeSearchViewElement extends View<Model, Msg> {
    @state()
    searchQuery: string = "";

    constructor() {
        super("guru:model"); // Connect to mu-store
    }

    handleSearch() {
        const query = this.searchQuery.toLowerCase();
        this.dispatchMessage(["recipes/search", { query }]);
        this.searchQuery = ""; // Reset search query
    }

    render() {
        const { recipes = [] } = this.model;

        return html`
      <main>
        <section class="search-section">
          <h2>Search for Recipes</h2>
          <div class="search-bar">
            <input
              type="text"
              id="recipe-keyword"
              placeholder="Enter recipe keyword..."
              .value="${this.searchQuery}"
              @input="${(e: Event) =>
            (this.searchQuery = (e.target as HTMLInputElement).value)}"
            />
            <button @click="${this.handleSearch}">Search</button>
          </div>
        </section>

        <section class="results-section">
          <h2>Search Results</h2>
          ${recipes.length === 0
            ? html`<p>No recipes found.</p>`
            : html`
                <ul class="recipe-list">
                  ${recipes.map(
                (recipe) =>
                    html`
                        <li>
                          <a href="recipes/${recipe.id}">${recipe.name}</a>
                        </li>
                      `
            )}
                </ul>
              `}
        </section>
      </main>
    `;
    }

    static styles = css`
    main {
      padding: 20px;
    }

    .search-section {
      margin-bottom: 20px;
    }

    .search-bar {
      display: flex;
      gap: 10px;
    }

    input {
      flex: 1;
      padding: 10px;
    }

    button {
      padding: 10px 20px;
      cursor: pointer;
    }

    .results-section {
      margin-top: 20px;
    }

    .recipe-list {
      list-style-type: none;
      padding: 0;
      margin: 10px 0;
    }

    .recipe-list li {
      padding: 5px 0;
    }

    .recipe-list a {
      text-decoration: none;
      color: blue;
    }
  `;
}

define({ "recipe-search-view": RecipeSearchViewElement });
