import express, { Request, Response } from "express";
import { Recipe } from "./pages/recipe";
import Recipes_Mongo from "./services/recipe-svc-mongo";
import auth from "./routes/auth";
import recipes from "./routes/recipes";
import vendors from "./routes/vendors";
import { connect } from "./services/mongo";
import { LoginPage, RegistrationPage } from "./pages/auth";

// Connect to the database
const dbName = process.env.DB_NAME || "cluster0";
connect(dbName); // Use environment variable or fallback to "cluster0"

const app = express();

// Serve static files from the specified directory
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(express.static(staticDir));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Authentication routes
app.use("/auth", auth);

// Protected routes
app.use("/api/recipes", recipes);
app.use("/api/vendors", vendors);

// Example route to check if the server is running
app.get("/hello", (_: Request, res: Response) => {
    res.send(
        `<h1>Hello!</h1>
     <p>Server is up and running.</p>
     <p>Serving static files from <code>${staticDir}</code>.</p>
    `
    );
});

// Login page route
app.get("/login", (_: Request, res: Response) => {
    const page = new LoginPage();
    res.set("Content-Type", "text/html").send(page.render());
});

// Registration page route
app.get("/register", (_: Request, res: Response) => {
    const page = new RegistrationPage();
    res.set("Content-Type", "text/html").send(page.render());
});

// Route to get a recipe by ID and render it
app.get("/recipe/:recipeId", async (req: Request, res: Response): Promise<void> => {
    const { recipeId } = req.params;
    try {
        const data = await Recipes_Mongo.get(recipeId);
        if (!data) {
            res.status(404).send("Recipe not found.");
            return;
        }
        const recipePage = new Recipe(data); // Create an instance of Recipe
        res.set("Content-Type", "text/html").send(recipePage.render());
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).send("Error fetching recipe.");
    }
});

// Export the app for Vercel
export default app;
