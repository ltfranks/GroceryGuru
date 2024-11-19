// main.ts
// @ts-ignore
import { Auth, define, History, Switch } from "@calpoly/mustang";
// @ts-ignore
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/header";
import { HomeViewElement } from "./views/home-view";

class AppElement extends LitElement {
    static uses = define({
        "home-view": HomeViewElement
    });

    protected render() {
        return html`
      <home-view></home-view>
    `;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }
}

const routes = [
    {
        path: "/app/recipe/:id",
        view: (params: Switch.Params) => html`
            <recipe-view item-id=${params.id}></recipe-view>
        `
    },
    {
        path: "/app/item/:id",
        view: (params: Switch.Params) => html`
            <item-view item-id=${params.id}></item-view>
        `
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
            super(routes, "guru:history");
        }
    },
    "grocery-guru-app": AppElement,
    "all-header": HeaderElement
});