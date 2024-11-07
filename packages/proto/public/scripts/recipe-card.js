import {html, css, shadow} from "@calpoly/mustang";

export class RecipeCard extends HTMLElement {

    get src() {
        return this.getAttribute("src")
    }

    static template = html`
        <template>
            <div class="container">
                <div class="recipe-header">
                    <h1>
                        <slot name="name">Recipe Title</slot>
                    </h1>
                    <div class="details">
                        <span><slot name="servings"></slot></span>
                        <span><slot name="prepTime">Prep time</slot></span>
                    </div>
                    <div class="recipe-image">
                        <img src="#" alt="Recipe Image"/>
                    </div>
                </div>

                <div class="recipe-body">
                    <div class="ingredients">
                        <h2>Ingredients</h2>
                        <ul>
                            <slot name="ingredients">
                            </slot>
                        </ul>
                    </div>

                    <div class="directions">
                        <h2>Directions</h2>
                        <ol>
                            <slot name="instructions">
                                <li>Step 1</li>
                                <li>Step 2</li>
                            </slot>
                        </ol>
                    </div>
                </div>

                <div class="recipe-notes">
                    <h3>Notes</h3>
                    <p>
                        <slot name="notes">Add any notes here.</slot>
                    </p>
                </div>
            </div>
        </template>`;

    static styles = css`
      :host {
        display: block;
        margin-bottom: 20px;

      }

      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 8px;
        //box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .recipe-header {
        text-align: center;
        margin-bottom: 20px;
        color: var(--color-text)
      }

      .details {
        display: flex;
        justify-content: center;
        gap: 20px;
        color: var(--color-text)
      }

      .recipe-body {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        margin-bottom: 20px;
      }

      .ingredients, .directions {
        width: 45%;
        color: var(--color-text)
      }

      .ingredients ul, .directions ol {
        list-style-position: inside;
        line-height: 1.6;
        color: var(--color-text)
      }

      .recipe-notes {
        margin-top: 20px;
        padding-left: 20px;
        border: 2px solid;
        color: var(--color-text)
      }

      .recipe-image {
        text-align: center;
        margin: 20px 0;
      }

      .recipe-image img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-style: solid;
      }
    `;

    constructor() {
        super();
        shadow(this)
            .template(RecipeCard.template)
            .styles(RecipeCard.styles);
    }

    connectedCallback() {
        if (this.src) this.hydrate(this.src);
    }

    // fetches the data from our REST API
    hydrate(url) {
        fetch(url)
            .then((res) => {
                if (res.status !== 200) throw `Status: ${res.status}`;
                return res.json();
            })
            .then((json) => this.renderSlots(json))
            .catch((error) =>
                console.log(`Failed to render data ${url}:`, error)
            );
    }

    renderSlots(json) {
        const entries = Object.entries(json);

        // Function to generate elements for each key-value pair
        const toSlot = ([key, value]) => {
            // Handle arrays (like ingredients or instructions)
            if (Array.isArray(value)) {
                const listElement = document.createElement(key === "instructions" ? "ol" : "ul");
                value.forEach((item) => {
                    const listItem = document.createElement("li");

                    // Handle object items in the array (e.g. ingredients details)
                    if (typeof item === "object" && item !== null) {
                        const { itemName, quantity, unit } = item;
                        listItem.textContent = `${quantity} ${unit} ${itemName}`;
                    } else {
                        // For string items in the instructions array
                        listItem.textContent = item;
                    }
                    listElement.appendChild(listItem);
                });
                listElement.setAttribute("slot", key);
                return listElement;
            }

            // Default case for strings, numbers, and other primitives
            const spanElement = document.createElement("span");
            spanElement.textContent = String(value);
            spanElement.setAttribute("slot", key);
            return spanElement;
        };

        // Create an array of elements using map and append them to a fragment
        const fragment = document.createDocumentFragment();
        entries.map(toSlot).forEach((el) => fragment.appendChild(el));

        // Replace the children of the custom element with the new fragment
        this.replaceChildren(fragment);
    }

}

customElements.define('recipe-card', RecipeCard);
