// @ts-ignore
import { css, html, LitElement } from "lit";
// @ts-ignore
import { state } from "lit/decorators.js";

export class LoginViewElement extends LitElement {
    @state()
    username: string = "";

    @state()
    password: string = "";

    @state()
    confirmPassword: string = ""; // For registration

    @state()
    errorMessage: string = "";

    @state()
    successMessage: string = "";

    @state()
    isRegister: boolean = false; // Toggles between Login and Register views

    handleLogin() {
        console.log("Attempting login with:", { username: this.username });

        fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, password: this.password }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Login successful!");
                    window.location.href = '/app'; // Redirect to home page
                } else {
                    throw new Error('Invalid username or password');
                }
            })
            .catch((error) => {
                console.error("Login failed:", error);
                this.errorMessage = "Invalid username or password. Please try again.";
            });
    }

    handleRegister() {
        console.log("Attempting registration with:", {
            username: this.username,
            password: this.password,
            confirmPassword: this.confirmPassword,
        });

        if (this.password !== this.confirmPassword) {
            this.errorMessage = "Passwords do not match!";
            return;
        }

        fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, password: this.password }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Registration successful!");
                    this.successMessage = "Registration successful! You can now log in.";
                    this.isRegister = false; // Switch to login view
                    this.errorMessage = ""; // Clear errors
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Registration failed');
                    });
                }
            })
            .catch((error) => {
                console.error("Registration failed:", error);
                this.errorMessage = error.message || "Registration failed. Please try again.";
            });
    }

    toggleView() {
        this.isRegister = !this.isRegister;
        this.errorMessage = "";
        this.successMessage = "";
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
    }

    render() {
        return html`
        <main class="page">
            <section>
                <h3>${this.isRegister ? "Register" : "Log in"}</h3>
                ${this.errorMessage
            ? html`<p class="error-message">${this.errorMessage}</p>`
            : ""}
                ${this.successMessage
            ? html`<p class="success-message">${this.successMessage}</p>`
            : ""}

                <form @submit="${(e: Event) => e.preventDefault()}">
                    <div>
                        <label for="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            .value="${this.username}"
                            @input="${(e: Event) => (this.username = (e.target as HTMLInputElement).value)}"
                        />
                    </div>
                    <div>
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            .value="${this.password}"
                            @input="${(e: Event) => (this.password = (e.target as HTMLInputElement).value)}"
                        />
                    </div>

                    ${this.isRegister
            ? html`
                            <div>
                                <label for="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    .value="${this.confirmPassword}"
                                    @input="${(e: Event) => (this.confirmPassword = (e.target as HTMLInputElement).value)}"
                                />
                            </div>
                          `
            : ""}

                    <button @click="${this.isRegister ? this.handleRegister : this.handleLogin}">
                        ${this.isRegister ? "Register" : "Login"}
                    </button>
                </form>

                <p>
                    ${this.isRegister
            ? html`
                            Already have an account?
                            <a @click="${this.toggleView}" href="javascript:void(0)">Login</a>
                          `
            : html`
                            Don't have an account?
                            <a @click="${this.toggleView}" href="javascript:void(0)">Register</a>
                          `}
                </p>
            </section>
        </main>
      `;
    }

    static styles = css`
      main.page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: var(--color-background);
      }

      section {
          
        max-width: 400px;
        width: 100%;
        background-color: var(--color-background-card);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ccc;
      }

      h3 {
        text-align: center;
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

        input {
            width: calc(100% - 20px); /* Adjust width to account for padding */
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box; /* Ensure padding and border are included in the width */
        }


        button {
            width: 100%;
            padding: 10px;
            background-color: var(--color-primary);
            color: var(--color-text-light);
            font-size: var(--size-type-medium);
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #ccc;
            transition: background-color 0.3s ease; /* Smooth hover effect */

        }

        button:hover {
            background-color: var(--button-hover-bg, grey);
        }

      p {
        text-align: center;
        margin-top: 15px;
      }

      .error-message {
        color: var(--color-error);
        text-align: center;
        margin-bottom: 10px;
      }

      .success-message {
        color: var(--color-success);
        text-align: center;
        margin-bottom: 10px;
      }
    `;
}
