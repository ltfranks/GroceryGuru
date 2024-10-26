

export interface Vendor{
    id: string;
    name: string;
    state: string;
    city: string;
    streetAddress: string;
    items: Item[];
}

export interface Item{
    id: string;
    name: string;
    price: number;
    category: string;
    storeId: string;
}

