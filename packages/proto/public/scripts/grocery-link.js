import { html, css, shadow } from "@calpoly/mustang";

export class GroceryLink extends HTMLElement {

    static template = html`<template>
        <div class="grocery-item">
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
    }
    .grocery-item {
        font-family: 'Roboto', sans-serif;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h3 {
        font-weight: 500;
        font-size: 18px;
    }
    a {
        text-decoration: none;
        color: #2c3e50;
    }
    a:hover {
        text-decoration: underline;
    }
    p {
        font-size: 14px;
        color: #7f8c8d;
    }
    `;

    constructor() {
        super();
        shadow(this)
            .template(GroceryLink.template)
            .styles(GroceryLink.styles);
    }
}
customElements.define('grocery-link', GroceryLink);
