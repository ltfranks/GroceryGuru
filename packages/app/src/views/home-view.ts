// src/views/home-view.ts
// @ts-ignore
import {define, View} from "@calpoly/mustang";
// @ts-ignore
import {css, html} from "lit";
// @ts-ignore
import {state, property} from "lit/decorators.js";
import {Model} from "../model";
import {Msg} from "../messages";

export class HomeViewElement extends View<Model, Msg> {
    @state()
    searchQuery: string = "";

    constructor() {
        super("guru:model"); // Connect to mu-store
    }
    @state()
    loading: boolean = false;


    connectedCallback() {
        super.connectedCallback();
        // @ts-ignore
        this.dispatchMessage(["vendors/load"]); // Trigger vendor fetching when the view is initialized
    }

    handleSearch() {
        const query = this.searchQuery.toLowerCase();
        // @ts-ignore
        this.dispatchMessage(["search/item", {query}]);
        this.searchQuery = ""; // Reset search query
    }

    handleRemove(itemId: string) {
        // Dispatch a message to remove the item from the cart
        // @ts-ignore
        this.dispatchMessage(["cart/removeItem", {itemId}]);
    }

    async handleCalculate() {
        this.loading = true; // Start loading spinner
        try {
            // Simulate API call or heavy computation
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Example delay

            // Dispatch a message to calculate the cheapest store
            this.dispatchMessage(["cart/calculateCheapestStore"]);
        } catch (error) {
            console.error("Error calculating cheapest store:", error);
        } finally {
            this.loading = false; // Stop loading spinner
        }
    }


    render() {
        const {cartItems = [], totalCost = 0, cheapestStore} = this.model;

        return html`
            <main>
                <section class="info-section">
                    <h2>Explore Items You Can Find In San Luis Obispo</h2>
                    <p>Discover from a small variety of items available in our database:</p>
                    <ul>
                        <li><strong>Dairy:</strong> 2% Reduced Fat Milk, Shredded Mozzarella Cheese, Organic Eggs</li>
                        <li><strong>Bakery:</strong> White Sandwich Bread</li>
                        <li><strong>Meat:</strong> Chicken Breast, Ground Beef</li>
                        <li><strong>Beverages:</strong> Coca-Cola Classic, Orange Juice, Bottled Water</li>
                        <li><strong>Fruits:</strong> Bananas, Apples</li>
                        <li><strong>Vegetables:</strong> Baby Carrots, Romaine Lettuce</li>
                        <li><strong>Snacks:</strong> Potato Chips</li>
                        <li><strong>Pantry:</strong> Oatmeal, Peanut Butter, Pasta, Cereal</li>
                        <li><strong>Frozen:</strong> Vanilla Ice Cream</li>
                        <li><strong>Prepared Foods:</strong> Rotisserie Chicken</li>
                    </ul>
                    <p>Use the search bar below to explore these products then <strong>calculate</strong> the best
                        basket in SLO!</p>
                </section>

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
                                            <li class="cart-item">
                                                <span>${item.name} (Vendor: ${item.vendorName}
                                                    ): $${item.price.toFixed(2)}</span>
                                                <button
                                                        class="remove-btn"
                                                        @click="${() => this.handleRemove(item.id)}"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        `
                        )}
                    </ul>
                    <button
                            class="calculate-btn"
                            @click="${this.handleCalculate}"
                            ?disabled="${this.loading}"
                    >
                        ${this.loading
                                ? html`<span class="spinner"></span> Calculating...`
                                : "Calculate Cheapest Basket"}
                    </button>

                    ${cheapestStore && cheapestStore.averageCost !== undefined
                            ? html`
                                <div class="cheapest-store">
                                    <h3>Cheapest Store: ${cheapestStore.name}</h3>
                                    <p>Total Basket Cost: $${cheapestStore.averageCost.toFixed(2)}</p>
                                </div>
                            `
                            : html`
                            `}

                </section>
            </main>
        `;
    }


    static styles = css`
      /* General Styling */

      main {
        padding: 20px;
        font-family: 'Arial', sans-serif;
      }

      /* Search Section Styling */

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
        background-color: var(--button-bg, black);
        color: var(--button-text, white);
        transition: background-color 0.3s ease; /* Smooth hover effect */
      }

      button:hover {
        background-color: var(--button-hover-bg, grey);
      }

      /* Cart Section Styling */

      .cart-section {
        margin-top: 20px;
      }

      .cart-items {
        list-style-type: none;
        padding: 0;
        margin: 10px 0;
      }

      .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
      }

      .remove-btn {
        background-color: red;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .remove-btn:hover {
        background-color: darkred;
      }

      .calculate-btn {
        margin-top: 10px;
        padding: 10px;
        background-color: green;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .calculate-btn[disabled] {
        background-color: grey;
        cursor: not-allowed;
      }

      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid white;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .cheapest-store {
        margin-top: 20px;
        padding: 10px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      .cheapest-store h3 {
        margin: 0;
        font-size: 1.2em;
      }

      .cheapest-store p {
        margin: 5px 0 0;
        font-size: 1em;
      }


      .info-section {
        margin-bottom: 20px;
        padding: 20px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
      }

      .info-section h2 {
        margin-bottom: 10px;
        font-size: 1.5em;
        color: #333;
      }

      .info-section p {
        font-size: 1em;
        line-height: 1.5;
        color: #555;
      }

      /* Dark Mode Placeholder */

      :host([theme="dark"]) {
        --button-bg: #333;
        --button-hover-bg: #555;
        --button-text: white;
      }
    `;
}

define({"home-view": HomeViewElement});
