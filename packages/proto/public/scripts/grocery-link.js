import { html, css, shadow } from "@calpoly/mustang";

export class GroceryLink extends HTMLElement {

    static template = html`<template>
        <div class="grocery-links">
            <h3>
                <a href="#"><slot name="store">Store Name</slot></a>
            </h3>
            <p>
                <span>Cost: </span><slot name="cost">$0.00</slot>
            </p>
        </div>
    </template>`;

    static styles = css`
    :host {
        display: block;
        margin-bottom: 10px;
      padding-left: 20px;
    }
      .grocery-links {
        margin-top: 20px;
      }

      .grocery-links h3 {
        margin-bottom: 10px;
      }

      .grocery-links ul {
        list-style-type: none;
        padding-left: 0;
      }

      .grocery-links ul li {
        padding-left: 20px;
        margin-bottom: 5px;
      }

      .grocery-links ul li a {
        text-decoration: underline;
      }
    `;

    constructor() {
        super();
        shadow(this)
            .template(GroceryLink.template)
            .styles(GroceryLink.styles);

        // Access the attributes and populate slots accordingly
        const store = this.getAttribute('store') || 'Unknown Store';
        const cost = this.getAttribute('cost') || '$0.00';
        const url = this.getAttribute('url') || '#';

        // Update the slots with the attributes
        this.shadowRoot.querySelector('slot[name="store"]').innerHTML = store;
        this.shadowRoot.querySelector('slot[name="cost"]').innerHTML = cost;
        this.shadowRoot.querySelector('a').setAttribute('href', url);
    }
}
customElements.define('grocery-link', GroceryLink);
