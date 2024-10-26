// src/index.ts
import express, { Request, Response } from "express";
import {getRecipe} from "./services/recipe-svc";
import {RecipePage} from "./pages/recipePage";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/recipe/:recipeId", (req: Request, res: Response) => {
    const { recipeId } = req.params;
    const data = getRecipe(recipeId); // Fetch the recipe based on ID

    if (data) {
        const page = new RecipePage(data); // Pass the data only if it exists
        res.set("Content-Type", "text/html").send(page.render());
    } else {
        res.status(404).send("Recipe not found"); // Error handling if recipe is missing
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});