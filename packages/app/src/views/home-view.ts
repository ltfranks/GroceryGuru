// @ts-ignore
import { Auth, Observer } from "@calpoly/mustang";
// @ts-ignore
import { css, html, LitElement } from "lit";
// @ts-ignore
import { state } from "lit/decorators.js";

// @ts-ignore
import { Vendor, Item } from "./models/vendor"; // vendor.ts - model

export class HomeViewElement extends LitElement {
    @state()
    searchQuery: string = "";

    @state()
    totalCost: number = 0;

    @state()
    cartItems: Array<{ name: string; price: number; vendorName: string }> = [];

    @state()
    vendors: Array<Vendor> = [];

    connectedCallback() {
        super.connectedCallback();
        this.hydrate();
    }

    hydrate() {
        // Fetch vendor data from your backend API
        fetch('/api/vendors')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Error fetching data: ${response.statusText}`);
            })
            .then((data) => {
                this.vendors = data || [];
            })
            .catch((error) => {
                console.error("Failed to fetch vendors:", error);
            });
    }

    handleSearch() {
        const query = this.searchQuery.toLowerCase();
        let cheapestItem: Item | null = null;
        let cheapestVendor: string | null = null;

        // Iterate through vendors and items to find the cheapest matching item
        this.vendors.forEach((vendor) => {
            vendor.items.forEach((item) => {
                if (item.name.toLowerCase().includes(query)) {
                    if (!cheapestItem || item.price < cheapestItem.price) {
                        cheapestItem = item;
                        cheapestVendor = vendor.name;
                    }
                }
            });
        });

        if (cheapestItem && cheapestVendor) {
            // Add the cheapest item to the cart
            this.cartItems.push({
                name: cheapestItem.name,
                price: cheapestItem.price,
                vendorName: cheapestVendor
            });
            this.totalCost += cheapestItem.price;
        } else {
            console.log("No items found.");
        }

        // Reset search query after adding to the cart
        this.searchQuery = "";
    }

    render() {
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
              @input="${(e: Event) => (this.searchQuery = (e.target as HTMLInputElement).value)}"
            />
            <button @click="${this.handleSearch}">Add to Cart</button>
          </div>
        </section>

        <section class="cart-section">
          <h2>Your Cart</h2>
          <div class="cart-summary">
            <p>Total Items: ${this.cartItems.length}</p>
            <p>Estimated Total: $${this.totalCost.toFixed(2)}</p>
          </div>
          <ul class="cart-items">
            ${this.cartItems.map(
            (item) => html`
                <li>${item.name} (Vendor: ${item.vendorName}): $${item.price.toFixed(2)}</li>
              `
        )}
          </ul>
        </section>
      </main>
    `;
    }

    static styles = css`
      /* Add your CSS styles here */
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
