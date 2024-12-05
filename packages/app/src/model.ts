export interface Item {
    id: string;
    name: string;
    price: number;
}

export interface Vendor {
    name: string;
    items: Item[];
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    vendorName: string;
    quantity?: number; // Optional quantity
}

export interface Recipe {
    id: string;
    name: string;
}

export interface Model {
    vendors: Vendor[];
    cartItems: CartItem[];
    totalCost: number;
    recipes: Recipe[];
}

export const init: Model = {
    vendors: [],
    cartItems: [],
    totalCost: 0,
    recipes: [],
};
