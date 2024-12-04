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
      :host {
        display: contents;
      }
      .header_layout {
        background-color: var(--color-background-header);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
      }
      .header_layout h1{
        color: var(--color-title);
      }

      .header_layout .nav_links a {
        color: black; /* Always black for all link states */
        padding-left: 40px;
        transition: color 0.3s ease, transform 0.3s ease; /* Smooth transition for color and transform */
      }

      .header_layout .nav_links a:visited {
        color: var(--color-link); /* Override the default visited color */
      }

      .header_layout .nav_links a:hover {
        color: white; /* Change to gray on hover */
        transform: scale(1.05); /* Slight zoom effect on hover */
      }

      .header_layout .nav_links a:active {
        color: var(--color-link); /* Stay black when clicked */
      }

      .header_layout .login a{
        margin-left: auto;
        padding-right: 10px;
        transition: color 0.3s ease, transform 0.3s ease;
      }

      .header_layout .login a:visited{
        color: var(--color-link);
      }

      .header_layout .login a:hover{
        color: white; /* Change to gray on hover */
        transform: scale(1.05); /* Slight zoom effect on hover */
      }

      .dark-mode-container {
        display: flex;
        align-items: center;
        margin-left: auto; /* Ensures the dark mode button stays to the right */
        margin-right: 15px; /* Adds some space between dark mode and login */
      }

      #dark-mode-checkbox {
        margin-left: 8px; /* Adds space between the label and checkbox */
      }
    `;
    // @ts-ignore
    toggleDarkMode(event) {
        const isChecked = event.target.checked;
        document.body.classList.toggle("dark-mode", isChecked);
    }
}
