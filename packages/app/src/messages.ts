export type Msg =
    | ["search/item", { query: string }]
    | ["cart/add", { item: { name: string; price: number; vendorName: string } }]
    | ["vendors/load"];
