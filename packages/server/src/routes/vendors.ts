import express, { Request, Response } from "express";
import { Vendor } from "../models/vendor";
import Vendors_Mongo from "../services/vendor-svc-mongo"; // Adjust the path if necessary

const router = express.Router();

// GET: Retrieve all vendors
router.get("/", (_, res: Response) => {
    Vendors_Mongo.index()
        .then((list: Vendor[]) => res.json(list))
        .catch((err: any) => res.status(500).send(err));
});

// GET: Retrieve a single vendor by ID
router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    Vendors_Mongo.get(id)
        .then((vendor: Vendor | null) => {
            if (vendor) {
                return res.json(vendor);
            } else {
                return res.status(404).send({ error: "Vendor not found" });
            }
        })
        .catch((err: any) => res.status(500).send(err));
});

// POST: Create a new vendor
router.post("/", (req: Request, res: Response) => {
    const newVendorData = req.body;

    Vendors_Mongo.create(newVendorData)
        .then((vendor: Vendor) => res.status(201).json(vendor))
        .catch((err) => res.status(500).send(err));
});

// PUT: Update an existing vendor by ID
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedVendorData = req.body;

    Vendors_Mongo.update(id, updatedVendorData)
        .then((updatedVendor: Vendor) => res.json(updatedVendor))
        .catch((err) => res.status(404).send({ error: "Vendor not found" }));
});

// DELETE: Remove a vendor by ID
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    Vendors_Mongo.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send({ error: "Vendor not found" }));
});

export default router;
