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
                        <slot name="title">Recipe Title</slot>
                    </h1>
                    <div class="details">
                        <span><slot name="servings">Servings</slot></span>
                        <span><slot name="prep-time">Prep time</slot></span>
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
                                <li>Ingredient 1</li>
                                <li>Ingredient 2</li>
                            </slot>
                        </ul>
                    </div>

                    <div class="directions">
                        <h2>Directions</h2>
                        <ol>
                            <slot name="directions">
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

        // Default attribute values if not provided
        const title = this.getAttribute('title') || 'Untitled Recipe';
        const servings = this.getAttribute('servings') || '0 servings';
        const prepTime = this.getAttribute('prep-time') || '0 minutes';
        const imageUrl = this.getAttribute('image-url') || '#';

        // Setting the slot content and image attributes
        this.shadowRoot.querySelector('slot[name="title"]').innerHTML = title;
        this.shadowRoot.querySelector('slot[name="servings"]').innerHTML = servings;
        this.shadowRoot.querySelector('slot[name="prep-time"]').innerHTML = prepTime;
        this.shadowRoot.querySelector('.recipe-image img').setAttribute('src', imageUrl);
        this.shadowRoot.querySelector('.recipe-image img').setAttribute('alt', `${title} image`);
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
        const fragment = document.createDocumentFragment();

        entries.forEach(([key, value]) => {
            if (Array.isArray(value)) {
                const listElement = document.createElement("ul");
                listElement.slot = key;
                value.forEach((item) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = item;
                    listElement.appendChild(listItem);
                });
                fragment.appendChild(listElement);
            } else {
                const spanElement = document.createElement("span");
                spanElement.slot = key;
                spanElement.textContent = value;
                fragment.appendChild(spanElement);
            }
        });

        this.replaceChildren(fragment);
    }


}

customElements.define('recipe-card', RecipeCard);
