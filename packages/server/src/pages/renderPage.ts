// @ts-ignore
import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults: PageParts = {
    stylesheets: [
        "/styles/reset.css",
        "/styles/tokens.css",
        "/styles/page.css"
    ],
    styles: [],
    scripts: [
        `import { define } from "@calpoly/mustang";
    import { HeaderElement } from "/scripts/header.js";

    define({
      "all-header": HeaderElement
    });

    HeaderElement.initializeOnce();
    `
    ],
    googleFontURL:
        "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap",
    imports: {
        "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
    }
};

export default function renderPage(page: PageParts) {
    return renderWithDefaults(page, defaults);
}