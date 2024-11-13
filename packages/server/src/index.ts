// src/index.ts
import express, { Request, Response } from "express";
import {Recipe} from "./pages/recipe";
import Recipes_Mongo from "./services/recipe-svc-mongo"
import auth from "./routes/auth";


// add this import near the top
import { connect } from "./services/mongo";
connect("cluster0"); // use your own db name here

const app = express();
const port = process.env.PORT || 3000;

// gets static files from proto/public
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(express.static(staticDir));

app.use(express.json());
app.use("/auth", auth);
import recipes from "./routes/recipes";
// tells express, anytime it receives HTTP request for a path that starts with /api/recipes, it should use our new router
app.use("/api/recipes", recipes)

app.get("/hello", (_: Request, res: Response) => {
    res.send(
        `<h1>Hello!</h1>
     <p>Server is up and running.</p>
     <p>Serving static files from <code>${staticDir}</code>.</p>
    `
    );
});

app.get("/recipe/:recipeId", async(req: Request, res: Response) => {
    const { recipeId } = req.params;
    Recipes_Mongo.get(recipeId).then((data) => {
        // creates instance of Recipe for res
        // @ts-ignore
        const recipePage = new Recipe(data);
        res.set("Content-Type", "text/html").send(recipePage.render()) // calls render on instance^
    })
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

