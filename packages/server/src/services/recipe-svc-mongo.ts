// @ts-ignore
import {Schema, model} from "mongoose";
import {Recipe} from "../models/recipe";

const IngredientSchema = new Schema({
    itemName: {type: String, required: true},
    quantity: {type: Number, required: true},
    unit: {type: String, required: true},
});

const RecipeSchema = new Schema(
    {
        id: {type: String, required: true},
        name: {type: String, required: true},
        servings: {type: String, required: true},
        prepTime: {type: String, required: true},
        ingredients: {type: [IngredientSchema], required: true},
        instructions: {type: [String], required: true},
        notes: {type: String}  // Optional field
    },
    {collection: "recipes"}
);

const RecipeModel = model<Recipe>("Profile", RecipeSchema);

function index(): Promise<Recipe[]>{
    return RecipeModel.find();
}

function get(id: string): Promise<Recipe | null> {
    // findOne retrieves a single document
    // using find() would return an array of docs if there more than one match
    return RecipeModel.findOne({ id })
        .then((recipe: any) => {
            if (!recipe) throw new Error(`Recipe with id ${id} not found`);
            return recipe;
        })
        .catch((err: any) => {
            throw new Error(`Error fetching recipe: ${err}`);
        });
}

function create(json: Recipe): Promise<Recipe> {
    const t = new RecipeModel(json);
    return t.save();
}

function update(
    id: String,
    recipe: Partial<Recipe>
): Promise<Recipe> {
    return RecipeModel.findOneAndUpdate({ id }, recipe, {
        new: true // returns new value of JSON
    }).then((updated: any) => {
        if (!updated) throw `${id} not updated`;
        else return updated as Recipe;
    });
}

function remove(id: String): Promise<void> {
    return RecipeModel.findOneAndDelete({ id }).then(
        (deleted:any) => {
            if (!deleted) throw `${id} not deleted`;
        }
    );
}

export default { index, get, create, update, remove };