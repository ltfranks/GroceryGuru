import express, { Request, Response } from "express";
import {Recipe} from "../models/recipe"

import Recipes_Mongo from "../services/recipe-svc-mongo"

const router = express.Router();

router.get("/", (_, res: Response) => {
    Recipes_Mongo.index()
        .then((list: Recipe[]) => res.json(list))
        .catch((err: any) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    Recipes_Mongo.get(id)
        .then((recipe: Recipe | null) => {
            if (recipe) {
                return res.json(recipe);
            } else { // if recipe isn't found send error
                return res.status(404).send({ error: "Recipe not found" });
            }
        })
        .catch((err: any) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newRecipeData = req.body;

    Recipes_Mongo.create(newRecipeData)
        .then((recipe: Recipe) =>
            res.status(201).json(recipe)
        )
        .catch((err) => res.status(500).send(err));
});

// schema is id not userid
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedRecipeData = req.body;

    Recipes_Mongo
        .update(id, updatedRecipeData)
        .then((updatedRecipeData: Recipe) => res.json(updatedRecipeData))
        .catch((err) => res.status(404).end());
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Recipes_Mongo.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;