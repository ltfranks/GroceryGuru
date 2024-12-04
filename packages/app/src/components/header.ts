// @ts-ignore
import {LitElement, css, html} from "lit";

export class HeaderElement extends LitElement {
    render() {
        return html`
            <header class="header_layout">
                <!-- TODO: insert contents of header here -->
                <h1>Grocery Guru</h1>
                <nav class="nav_links">
                    <a href="../app">Home</a>
                    <a href="../app/recipe-search-view">Recipes Search</a>
                    <a href="../nav_links/about.html">About</a>
                </nav>
                <div class="dark-mode-container">
                    <label>
                        <input
                                type="checkbox"
                                autocomplete="off"
                                class="dark-mode-switch"
                                id="dark-mode-checkbox"
                                @change="${this.toggleDarkMode}"
                        />
                        Dark mode
                    </label>
                <a slot="actuator">
                    Hello,
                    <span id="userid"></span>
                </a>
                <div class="login">
                    <a href="../app/login">Login</a>
                </div>
            </header>
        `;
    }

    static styles = css`
      /* TODO: Style the header here */

      .header_layout {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;

      }

      .header_layout .nav_links {
        display: flex;
        gap: 20px;
        padding-left: 25px;
      }

      .header_layout .login {
        margin-left: auto;
        padding-right: 10px;
      }

      body {
        font-family: var(--font-family-header);
        background-color: var(--color-background-page);
      }

      header {
        font-family: var(--font-family-header);
        background-color: var(--color-background-header);
        color: var(--color-text-inverted);

      }

      header a {
        color: var(--color-link-inverted);
      }

      body > section {
      }

      h1 {
        font-size: var(--size-type-xxlarge);
        font-style: oblique;
        line-height: 1;
        font-weight: var(--font-weight-bold);
      }

      h2 {
        font-size: var(--size-type-large);
        fontweight: var(--font-weight-bold);
      }

      h3 {
        font-size: var(--size-type-mlarge)
      }

      ul {
        font-size: var(--size-type-body);
      }

      a:link {
        color: var(--color-link);
      }
      
    `;
    // @ts-ignore
    toggleDarkMode(event) {
        const isChecked = event.target.checked;
        document.body.classList.toggle("dark-mode", isChecked);
    }
}
