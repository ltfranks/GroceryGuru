// @ts-ignore
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    switch (message[0]) {
        case "vendors/load":
            fetchVendors(user)
                .then((vendors) =>
                    apply((model) => ({
                        ...model,
                        vendors,
                    }))
                )
                .catch((error) => {
                    console.error("Failed to fetch vendors:", error);
                });
            break;

            // searches for the cheapest item closest to keyword
        case "search/item":
            const { query } = message[1];
            apply((model) => {
                const lowerCaseQuery = query.toLowerCase();
                let cheapestItem: { name: string; price: number; vendorName: string } | null = null;

                model.vendors.forEach((vendor) => {
                    vendor.items.forEach((item) => {
                        if (item.name.toLowerCase().includes(lowerCaseQuery)) {
                            if (!cheapestItem || item.price < cheapestItem.price) {
                                cheapestItem = {
                                    name: item.name,
                                    price: item.price,
                                    vendorName: vendor.name,
                                };
                            }
                        }
                    });
                });

                if (cheapestItem) {
                    console.log(`Adding to cart: ${cheapestItem.name} from ${cheapestItem.vendorName}`);
                    return {
                        ...model,
                        cartItems: [...model.cartItems, cheapestItem],
                        totalCost: model.totalCost + cheapestItem.price,
                    };
                } else {
                    console.warn(`No items found for query: ${query}`);
                    return model; // No updates if no item matches
                }
            });
            break;
        case "recipes/search":
            handleRecipeSearch(message[1].query, apply, user);
            break;

        case "cart/add":
            apply((model) => ({
                ...model,
                cartItems: [...model.cartItems, message[1].item],
                totalCost: model.totalCost + message[1].item.price,
            }));
            break;

        default:
            const unhandled: never = message[0];
            throw new Error(`Unhandled Auth message "${unhandled}"`);
    }
}

function handleRecipeSearch(
    query: string,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    fetchRecipes(user)
        .then((recipes) => {
            const lowerCaseQuery = query.toLowerCase();
            const filteredRecipes = recipes.filter((recipe) =>
                recipe.name.toLowerCase().includes(lowerCaseQuery)
            );

            apply((model) => ({
                ...model,
                recipes: filteredRecipes,
            }));
        })
        .catch((error) => {
            console.error("Failed to fetch recipes:", error);
        });
}

function fetchVendors(user: Auth.User): Promise<Model["vendors"]> {
    return fetch("/api/vendors", {
        headers: Auth.headers(user),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized: User must log in.");
                }
                throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (Array.isArray(data)) {
                return data as Model["vendors"];
            } else {
                throw new Error("Unexpected response format");
            }
        });
}

function fetchRecipes(user: Auth.User): Promise<Model["recipes"]> {
    return fetch("/api/recipes", {
        headers: Auth.headers(user),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized: User must log in.");
                }
                throw new Error(`API error: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (Array.isArray(data)) {
                return data as Model["recipes"];
            } else {
                throw new Error("Unexpected response format");
            }
        });
}
