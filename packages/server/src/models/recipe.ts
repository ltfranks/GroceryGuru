// src/models/recipe.ts
export interface Ingredient {
    itemName: string;
    quantity: number;
    unit: string;
}


export interface Recipe {
    id: string;
    name: string;
    servings: string;
    prepTime: string;
    ingredients: Ingredient[];
    instructions: string[];
    notes?: string;         // Optional notes field
}
