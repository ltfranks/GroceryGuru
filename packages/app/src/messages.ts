export type Msg =
    | ["search/item", { query: string }]
    | ["cart/add", { item: { name: string; price: number; vendorName: string } }]
    | ["cart/removeItem", { itemId: string }]
    | ["vendors/load"]
    | ["recipes/search", {query: string}];
