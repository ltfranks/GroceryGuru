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

    handleRemove(itemId: string) {
        // Dispatch a message to remove the item from the cart
        // @ts-ignore
        this.dispatchMessage(["cart/removeItem", { itemId }]);
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
                                            <li class="cart-item">
                                                <span>${item.name} (Vendor: ${item.vendorName}): $${item.price.toFixed(2)}</span>
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

        /* Dark Mode Placeholder */
        :host([theme="dark"]) {
            --button-bg: #333;
            --button-hover-bg: #555;
            --button-text: white;
        }
    `;
}

define({ "home-view": HomeViewElement });
