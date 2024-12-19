// src/views/recipe-search-view.ts
import {define, View} from "@calpoly/mustang";
import {css, html} from "lit";
import {state} from "lit/decorators.js";
import {Model} from "../model";
import {Msg} from "../messages";

export class RecipeSearchViewElement extends View<Model, Msg> {
    @state()
    searchQuery: string = "";

    constructor() {
        super("guru:model"); // Connect to mu-store
    }

    handleSearch() {
        const query = this.searchQuery.toLowerCase();
        this.dispatchMessage(["recipes/search", {query}]);
        this.searchQuery = ""; // Reset search query
    }

    render() {
        const {recipes = []} = this.model;

        return html`
            <main>
                <h2>Search for Recipes</h2>
                <p>
                    Looking for cooking inspiration? Use the search bar below to find recipes
                    by entering keywords like "Alfredo," or "Cookies." Discover a variety of dishes
                    to suit your taste and ingredients!
                </p>
                <p>
                    <strong>Note: </strong> clicking search with an empty search bar will pop up all recipes!
                </p>
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
      }

      input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-right: none;
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
        outline: none;
      }

      button {
        padding: 10px 20px;
        cursor: pointer;
        border: 1px solid #ccc;
        border-left: none;
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
        background-color: black;
        color: white;
        transition: background-color 0.3s ease; /* Add this line */
      }

      button:hover {
        background-color: grey;
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
        padding: 10px;
        margin-bottom: 5px;
        border: 1px solid #ccc;
        border-radius: 10px; /* Rounded corners */
        background-color: #f9f9f9; /* Subtle background color */
        cursor: pointer; /* Pointer cursor to indicate clickability */
        transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover effects */
      }

      .recipe-list li:hover {
        background-color: #e0e0e0; /* Slightly darker background on hover */
        transform: scale(1.02); /* Subtle zoom-in effect */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a shadow for emphasis */
      }

      .recipe-list a {
        text-decoration: none;
        color: black; /* Default color for unvisited links */
        font-weight: bold; /* Make the link text stand out */
        transition: color 0.3s ease; /* Smooth transition for color change */
      }

      .recipe-list a:visited {
        color: purple; /* Change color for visited links */
      }

    `;

}

define({"recipe-search-view": RecipeSearchViewElement});
