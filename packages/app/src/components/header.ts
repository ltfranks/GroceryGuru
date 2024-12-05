// @ts-ignore
import {LitElement, css, html} from "lit";

export class HeaderElement extends LitElement {
    render() {
        return html`
            <header class="header_layout">
                <h1>Grocery Guru</h1>
                <nav class="nav_links">
                    <a href="../app">Home</a>
                    <a href="../app/recipe-search-view">Recipes Search</a>
                    <a href="../app/about-view">About</a>
                </nav>
                <div class="action-container">
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
                    </div>
                    <div class="login">
                        <a href="../app/login">Login</a>
                    </div>
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

        .header_layout h1 {
            color: var(--color-title);
            margin-right: auto;
        }

        .header_layout .nav_links {
            display: flex;
            gap: 80px; /* Space between navigation links */
            margin-right: auto;
            margin-left: 40px;
        }

        .header_layout .nav_links a {
            color: black;
            text-decoration: none;
            transition: color 0.3s ease, transform 0.3s ease;
        }

        .header_layout .nav_links a:hover {
            color: white;
            transform: scale(1.05);
        }

        .action-container {
            display: flex;
            align-items: center;
            gap: 20px; /* Add spacing between dark mode and login */
        }

        .dark-mode-container {
            display: flex;
            align-items: center;
            gap: 10px; /* Space between label and checkbox */
        }

        .login a {
            color: black;
            text-decoration: none;
            transition: color 0.3s ease, transform 0.3s ease;
        }

        .login a:hover {
            color: white;
            transform: scale(1.05);
        }

        #dark-mode-checkbox {
            margin-left: 5px;
        }
    `;

    // @ts-ignore
    toggleDarkMode(event) {
        const isChecked = event.target.checked;
        document.body.classList.toggle("dark-mode", isChecked);
    }
}
