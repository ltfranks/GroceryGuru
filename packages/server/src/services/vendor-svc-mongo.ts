import { Schema, model } from "mongoose";
import { Vendor } from "../models/vendor";

// Define the Item schema
const ItemSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    storeId: { type: String, required: true }
});

// Define the Vendor schema
const VendorSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        streetAddress: { type: String, required: true },
        items: { type: [ItemSchema], required: true }
    },
    { collection: "vendors" }
);

// Create the Vendor model
const VendorModel = model<Vendor>("Vendor", VendorSchema);

// Retrieve all vendors
function index(): Promise<Vendor[]> {
    return VendorModel.find();
}

// Retrieve a single vendor by ID
function get(id: string): Promise<Vendor | null> {
    return VendorModel.findOne({ id })
        .then((vendor: any) => {
            if (!vendor) throw new Error(`Vendor with id ${id} not found`);
            return vendor;
        })
        .catch((err: any) => {
            throw new Error(`Error fetching vendor: ${err}`);
        });
}

// Create a new vendor
function create(json: Vendor): Promise<Vendor> {
    const newVendor = new VendorModel(json);
    return newVendor.save();
}

// Update an existing vendor by ID
function update(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
    return VendorModel.findOneAndUpdate({ id }, vendor, {
        new: true // Return the updated document
    }).then((updated: any) => {
        if (!updated) throw new Error(`${id} not updated`);
        return updated as Vendor;
    });
}

// Delete a vendor by ID
function remove(id: string): Promise<void> {
    return VendorModel.findOneAndDelete({ id }).then((deleted: any) => {
        if (!deleted) throw new Error(`${id} not deleted`);
    });
}

// Export the CRUD functions
export default { index, get, create, update, remove };
