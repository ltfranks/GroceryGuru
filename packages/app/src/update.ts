// @ts-ignore
import {Auth, Update} from "@calpoly/mustang";
import {Msg} from "./messages";
import {CartItem, Model} from "./model";

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

        case "search/item":
            const {query} = message[1];
            apply((model) => {
                const lowerCaseQuery = query.toLowerCase();

                let cheapestItem = null as CartItem | null;

                model.vendors.forEach((vendor) => {
                    vendor.items.forEach((item) => {
                        if (item.name.toLowerCase().includes(lowerCaseQuery)) {
                            if (!cheapestItem || item.price < cheapestItem.price) {
                                cheapestItem = {
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    vendorName: vendor.name,
                                };
                            }
                        }
                    });
                });

                if (cheapestItem !== null) {
                    // TypeScript now knows `cheapestItem` is not null
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


        case "cart/removeItem":
            const {itemId} = message[1];
            apply((model) => {
                // Find the index of the first item with the matching ID
                const itemIndex = model.cartItems.findIndex((item) => item.id === itemId);
                if (itemIndex !== -1) {
                    // Create a new cart array without the specified item
                    const updatedCart = [...model.cartItems];
                    const [removedItem] = updatedCart.splice(itemIndex, 1);

                    // Update the total cost
                    const updatedTotalCost = model.totalCost - removedItem.price * (removedItem.quantity || 1);

                    return {
                        ...model,
                        cartItems: updatedCart,
                        totalCost: updatedTotalCost,
                    };
                }

                // If no matching item is found, return the unchanged model
                return model;
            });
            break;

        case "cart/calculateCheapestStore":
            apply((model) => {
                let cheapestVendor = null;
                let lowestTotalCost = Infinity;

                model.vendors.forEach((vendor) => {
                    const vendorTotal = model.cartItems.reduce((sum, item) => {
                        const vendorItem = vendor.items.find((vItem) => vItem.name === item.name);
                        return vendorItem ? sum + vendorItem.price : sum;
                    }, 0);

                    const allItemsAvailable = model.cartItems.every((item) =>
                        vendor.items.some((vItem) => vItem.name === item.name)
                    );

                    if (allItemsAvailable && vendorTotal < lowestTotalCost) {
                        lowestTotalCost = vendorTotal;
                        cheapestVendor = vendor.name;
                    }
                });

                return {
                    ...model,
                    cheapestStore: cheapestVendor
                        ? { name: cheapestVendor, averageCost: lowestTotalCost }
                        : undefined,
                };
            });
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
