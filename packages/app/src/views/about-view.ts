// src/views/about-view.ts
import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { Model } from "../model";
import { Msg } from "../messages";

export class AboutViewElement extends View<Model, Msg> {
    constructor() {
        super("guru:model"); // Connect to mu-store
    }

    render() {
        return html`
      <main>
        <section class="about-section">
          <div class="about-content">
            <h1>About Grocery Guru</h1>
            <p>
              Grocery Guru is dedicated to tackling food waste and helping families save money. We aggregate grocery prices from a wide range of stores, allowing users to compare and find the best deals. By encouraging stores to sell near-expiry items, we play a crucial role in reducing food waste while making shopping more affordable.
            </p>
          </div>
        </section>
      </main>
    `;
    }

    static styles = css`
    header.header_layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      background-color: #f8f8f8;
    }

    header h1 {
      margin: 0;
    }

    .nav_links {
      display: flex;
      gap: 15px;
    }

    .nav_links a {
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }

    .login a {
      text-decoration: none;
      color: #333;
    }

    main {
      padding: 20px;
    }

    .about-section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 40px 0;
    }

    .about-content {
      flex: 1;
      padding-right: 20px;
    }

    .about-content h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
    }

    .about-content p {
      font-size: 1.2em;
      line-height: 1.6;
    }

    .about-image {
      flex: 1;
      text-align: center;
    }

    .about-image img {
      max-width: 100%;
      height: auto;
    }
  `;
}

define({ "about-view": AboutViewElement });
