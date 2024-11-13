import {html, css, shadow, Dropdown, Events, Observer} from "@calpoly/mustang";


export class HeaderElement extends HTMLElement {
    static template = html`
        <template>
            <header class="header_layout">
                <h1>Grocery Guru</h1>
                <nav class="nav_links">
                    <a href="../index.html">Home</a>
                    <a href="../nav_links/vendors.html">Vendors</a>
                    <a href="../nav_links/recipes.html">Recipes</a>
                    <a href="../nav_links/about.html">About</a>
                </nav>
                <div class="dark-mode-container">
                    <label>
                        <input type="checkbox" autocomplete="off" class="dark-mode-switch" id="dark-mode-checkbox"/>
                        Dark mode
                    </label>
                    
                </div>
                <a slot="actuator">
                    Hello,
                    <span id="userid"></span>
                </a>
                <div class="login">
                    <a href="nav_links/login.html">Login</a>
                </div>
            </header>
        </template>
    `;

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

    get userid() {
        // Return the text content of the #userid span
        return this.shadowRoot.querySelector("#userid").textContent;
    }

    set userid(id) {
        // Set the text content of the #userid span
        const userIdElement = this.shadowRoot.querySelector("#userid");
        if (userIdElement) {
            userIdElement.textContent = id === "anonymous" ? "" : id;
        }
    }

    constructor() {
        super();
        shadow(this)
            .template(HeaderElement.template)
            .styles(HeaderElement.styles);


        const dm = this.shadowRoot.querySelector(
            ".dark-mode-switch"
        );

        dm.addEventListener("click", (event) =>
            Events.relay(event, "dark-mode", {
                checked: event.target.checked
            })
        );
    }

    _authObserver = new Observer(this, "blazing:auth");

    connectedCallback() {
        this._authObserver.observe(({ user }) => {
            if (user && user.username !== this.userid) {
                this.userid = user.username;
            }
        });
    }

    static initializeOnce() {
        function toggleDarkMode(page, checked) {
            page.classList.toggle("dark-mode", checked);
        }

        document.body.addEventListener("dark-mode", (event) =>
            toggleDarkMode(event.currentTarget, event.detail.checked)
        );
    }
}
