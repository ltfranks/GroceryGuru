// main.ts
// @ts-ignore
import { Auth, define, History, Switch } from "@calpoly/mustang";
// @ts-ignore
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/header";
import { HomeViewElement } from "./views/home-view";
import {RecipeViewElement} from "./views/recipe-view";
import {LoginViewElement} from "./views/login-view";

class AppElement extends LitElement {
    static uses = define({
        "home-view": HomeViewElement,
        "recipe-view": RecipeViewElement,
        "login-view": LoginViewElement
    });

    render() {
        return html`<mu-switch></mu-switch>`;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }
}

const routes = [
    {
        path: "/app/recipes/:id",
        view: (params: Switch.Params) => html`
            <recipe-view itemId="${params.id}"></recipe-view>
        `
    },
    {
        path: "/app/login",
        view: () => html`<login-view></login-view>`
    },
    {
        path: "/app",
        view: () => html`
            <home-view></home-view>
        `
    },
    {
        path: "/",
        redirect: "/app"
    }
];


define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "guru:history", "guru:auth");
        }
    },
    "grocery-guru-app": AppElement,
    "all-header": HeaderElement,
    "recipe-view": RecipeViewElement
});