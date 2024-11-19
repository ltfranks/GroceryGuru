import {define, Form, InputArray, html, css, shadow} from "@calpoly/mustang";

export class RecipeCard extends HTMLElement {
    static uses = define({
        "mu-form": Form.Element,
        "input-array": InputArray.Element
    });

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
                <button id="edit">Editor</button>
                <section class="view">
                    <!-- rest of the view here -->
                    <mu-form class="edit">
                        <label>
                            <span>Recipe Title</span>
                            <input name="name"/>
                        </label>
                        <label>
                            <span>Servings</span>
                            <input name="servings"/>
                        </label>
                        <label>
                            <span>Prep Time</span>
                            <input name="prepTime"/>
                        </label>
                        <label>
                            <span>Ingredients</span>
                            <input-array name="ingredients">
                                <span slot="label-add">Add an ingredient</span>
                            </input-array>
                        </label>
                        <label>
                            <span>Instructions</span>
                            <input-array name="instructions">
                                <span slot="label-add">Add an instruction</span>
                            </input-array>
                        </label>
                        <label>
                            <span>Notes</span>
                            <textarea name="notes"></textarea>
                        </label>
                    </mu-form>
                </section>
                
            </div>
        </template>`;

    static styles = css`
      :host {
        display: contents;
        margin-bottom: 20px;
      }
      :host([mode="edit"]) {
        --display-view-none: none;
        --display-editor-none: block;
      }
      :host([mode="view"]) {
        --display-view-none: block;
        --display-editor-none: none;
      }

      section.view {
        display: var(--display-view-none, block);
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
        this.setAttribute("mode", "view"); // Set default mode to "view"
        this.addEventListener("mu-form:submit", (event) =>
            this.submit(this.src, event.detail)
        );
        this.editButton.addEventListener("click", () => {
            this.mode = this.mode === "edit" ? "view" : "edit";
            console.log("Mode toggled to:", this.mode); // Debugging line
        });

    }

    connectedCallback() {
        if (this.src) this.hydrate(this.src);
    }


    get form() {
        return this.shadowRoot.querySelector("mu-form.edit");
    }
    get editButton() {
        return this.shadowRoot.getElementById("edit");
    }

    // these modes allow the form to be viewable
    get mode() {
        return this.getAttribute("mode");
    }

    set mode(m) {
        this.setAttribute("mode", m);
    }

    // fetches the data from our REST API
    hydrate(url) {
        fetch(url)
            .then((res) => {
                if (res.status !== 200) throw `Status: ${res.status}`;
                return res.json();
            })
            .then((json) => {
                this.renderSlots(json);
                this.form.init = json;  // populate the form
            })
            .catch((error) =>
                console.log(`Failed to render data ${url}:`, error)
            );
    }


    submit(url, json) {
        fetch(url, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(json)
        })
            .then((res) => res.json())
            .then((json) => {
                this.renderSlots(json);
                this.form.init = json;
                this.mode = "view"; // Switch back to view mode
            })
            .catch((error) => console.log("Failed to submit data:", error));
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
                        const {itemName, quantity, unit} = item;
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
