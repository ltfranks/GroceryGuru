export interface Vendor {
    name: string;
    items: Array<{ name: string; price: number }>;
}

export interface CartItem {
    name: string;
    price: number;
    vendorName: string;
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
    recipes: []
};
