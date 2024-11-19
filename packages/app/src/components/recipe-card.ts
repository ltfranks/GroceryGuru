// @ts-ignore
import { LitElement, css, html } from "lit";

export class RecipeCard extends LitElement {
    render() {
        return html`
      <div class="recipe-card">
        <div class="recipe-header">
          <h1><slot name="name">Recipe Title</slot></h1>
          <div class="details">
            <span><slot name="servings">Servings</slot></span>
            <span><slot name="prepTime">Prep Time</slot></span>
          </div>
        </div>
        <div class="recipe-image">
          <img src="#" alt="Recipe Image" />
        </div>
        <div class="recipe-body">
          <div class="ingredients">
            <h2>Ingredients</h2>
            <ul><slot name="ingredients"></slot></ul>
          </div>
          <div class="directions">
            <h2>Directions</h2>
            <ol><slot name="instructions"></slot></ol>
          </div>
        </div>
        <div class="recipe-notes">
          <h3>Notes</h3>
          <p><slot name="notes">No additional notes</slot></p>
        </div>
      </div>
    `;
    }

    static styles = css`
    .recipe-card {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 8px;
      background-color: var(--color-background-card);
      color: var(--color-text);
    }

    .recipe-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .details {
      display: flex;
      justify-content: center;
      gap: 20px;
      font-size: var(--size-type-body);
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
    }

    .recipe-body {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    .ingredients,
    .directions {
      width: 45%;
    }

    .ingredients ul,
    .directions ol {
      list-style-position: inside;
      line-height: 1.6;
    }

    .recipe-notes {
      margin-top: 20px;
      border-top: 1px solid var(--color-border);
      padding-top: 10px;
    }

    h1, h2, h3 {
      font-family: var(--font-family-header);
    }

    h1 {
      font-size: var(--size-type-xxlarge);
    }

    h2 {
      font-size: var(--size-type-large);
    }

    h3 {
      font-size: var(--size-type-medium);
    }

    p, span, li {
      font-size: var(--size-type-body);
    }
  `;
}
