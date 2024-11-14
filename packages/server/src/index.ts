// src/index.ts
import express, { Request, Response } from "express";
import { Recipe } from "./pages/recipe";
import Recipes_Mongo from "./services/recipe-svc-mongo";
import auth, { authenticateUser } from "./routes/auth";
import recipes from "./routes/recipes";
import { connect } from "./services/mongo"; // Connect to the database
import {LoginPage, RegistrationPage} from "./pages/auth"

// Connect to the database
connect("cluster0"); // Use your own DB name here

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the specified directory
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(express.static(staticDir));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Authentication routes
app.use("/auth", auth);

// Protected routes (example: recipes)
app.use("/api/recipes", recipes);
//app.use("/api/recipes", authenticateUser, recipes); // Protect /api/recipes with the authentication middleware

// Example route to check if the server is running
app.get("/hello", (_: Request, res: Response) => {
    res.send(
        `<h1>Hello!</h1>
         <p>Server is up and running.</p>
         <p>Serving static files from <code>${staticDir}</code>.</p>
        `
    );
});

app.get("/login", (req: Request, res: Response) => {
    const page = new LoginPage();
    res.set("Content-Type", "text/html").send(page.render());
});

app.get("/register", (req: Request, res: Response) => {
    const page = new RegistrationPage();
    res.set("Content-Type", "text/html").send(page.render());
});
// Route to get a recipe by ID and render it
app.get("/recipe/:recipeId", async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    try {
        const data = await Recipes_Mongo.get(recipeId);
        // Create an instance of Recipe for the response
        // @ts-ignore
        const recipePage = new Recipe(data);
        res.set("Content-Type", "text/html").send(recipePage.render()); // Call render on the instance
    } catch (error) {
        res.status(500).send("Error fetching recipe.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
