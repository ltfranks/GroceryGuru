// src/views/home-view.ts
// @ts-ignore
import { define, View } from "@calpoly/mustang";
// @ts-ignore
import { css, html } from "lit";
// @ts-ignore
import { state, property } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";

export class HomeViewElement extends View<Model, Msg> {
    @state()
    searchQuery: string = "";

    constructor() {
        super("guru:model"); // Connect to mu-store
    }

    connectedCallback() {
        super.connectedCallback();
        // @ts-ignore
        this.dispatchMessage(["vendors/load"]); // Trigger vendor fetching when the view is initialized
    }

    handleSearch() {
        const query = this.searchQuery.toLowerCase();
        // @ts-ignore
        this.dispatchMessage(["search/item", { query }]);
        this.searchQuery = ""; // Reset search query
    }

    render() {
        const { cartItems = [], totalCost = 0 } = this.model;

        return html`
      <main>
        <section class="search-section">
          <h2>Search for Items</h2>
          <div class="search-bar">
            <input
              type="text"
              id="item-name"
              placeholder="Enter item name..."
              .value="${this.searchQuery}"
              @input="${(e: Event) =>
            (this.searchQuery = (e.target as HTMLInputElement).value)}"
            />
            <button @click="${this.handleSearch}">Add to Cart</button>
          </div>
        </section>

        <section class="cart-section">
          <h2>Your Cart</h2>
          <div class="cart-summary">
            <p>Total Items: ${cartItems.length}</p>
            <p>Estimated Total: $${totalCost.toFixed(2)}</p>
          </div>
          <ul class="cart-items">
            ${cartItems.map(
            (item) =>
                html`
                  <li>
                    ${item.name} (Vendor: ${item.vendorName}): $
                    ${item.price.toFixed(2)}
                  </li>
                `
        )}
          </ul>
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

      .cart-section {
        margin-top: 20px;
      }

      .cart-items {
        list-style-type: none;
        padding: 0;
        margin: 10px 0;
      }

      .cart-items li {
        padding: 5px 0;
      }
    `;
}

define({ "home-view": HomeViewElement });
