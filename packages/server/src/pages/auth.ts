import {html} from "@calpoly/mustang/server";
import renderPage from "./renderPage";

export class LoginPage {
    render() {
        return renderPage({
            stylesheets: ["/styles/login_layout.css"],
            scripts: [
                `import { define, Auth } from "@calpoly/mustang";
                 import { LoginForm } from "/scripts/login-form.js";

                 define({
                 "mu-auth": Auth.Provider,
                 "login-form": LoginForm
                 });`
            ],
            body: html`
                <body>
                <mu-auth provides="blazing:auth">
                    <article>
                        <main class="page">
                            <login-form api="/auth/login">
                                <h3 slot="title">Sign in</h3>
                            </login-form>
                            <p class="register">
                                Or did you want to
                                <a href="./register">
                                    register as a new user
                                </a>
                                ?
                            </p>
                        </main>
                    </article>
                </mu-auth>
                </body>
            `
        });
    }
}export class RegistrationPage {
    render() {
        return renderPage({
            scripts: [
                `
        import { define, Auth } from "@calpoly/mustang";
        import { RegistrationForm } from "/scripts/registration-form.js";

        define({
          "mu-auth": Auth.Provider,
          "registration-form": RegistrationForm
        })
        `
            ],
            body: html`<body>
        <mu-auth provides="blazing:auth">
          <article>
            <main class="page">
              <registration-form api="/auth/register">
                <h3 slot="title"
                  >Sign up to start getting more green!</h3
                >
              </registration-form>
              <p class="login">
                Already signed up? You can
                <a href="./login">log in</a> instead.
              </p>
            </main>
          </article>
        </mu-auth>
      </body> `
        });
    }
}
