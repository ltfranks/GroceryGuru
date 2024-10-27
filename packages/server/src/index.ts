// src/index.ts
import express, { Request, Response } from "express";
import {getRecipe} from "./services/recipe-svc";
import {RecipePage} from "./pages/recipePage";
import Recipes_Mongo from "./services/recipe-svc-mongo"

// add this import near the top
import { connect } from "./services/mongo";
connect("cluster0"); // use your own db name here

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/recipe/:recipeId", async(req: Request, res: Response) => {
    const { recipeId } = req.params;
    Recipes_Mongo.get(recipeId).then((data) => {
        // creates instance of RecipePage for res
        const recipePage = new RecipePage(data);
        res.set("Content-Type", "text/html").send(recipePage.render()) // calls render on instance^
    })
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});