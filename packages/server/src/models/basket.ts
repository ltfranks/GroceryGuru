export interface Basket{
    id: string;
    userId: string;
    items: BasketItem[];
    totalPrice: number;
}

export interface BasketItem{
    itemId: string;
    quantity: number;
    price: number;
}