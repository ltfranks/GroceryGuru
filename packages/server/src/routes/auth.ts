import dotenv from "dotenv";
import express, {
    NextFunction,
    Request,
    Response
} from "express";

import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string =
    process.env.TOKEN_SECRET || "NOT_A_SECRET";

function generateAccessToken(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username },
            TOKEN_SECRET,
            { expiresIn: "1d" },
            (error, token: string | undefined) => { // Explicitly define token as string | undefined
                if (error || !token) {
                    reject(error || new Error("Token generation failed"));
                } else {
                    resolve(token);
                }
            }
        );
    });
}


router.post("/register", (req: Request, res: Response) => {
    const { username, password } = req.body; // from form

    if (!username || !password) {
        res.status(400).send("Bad request: Invalid input data.");
    } else {
        credentials
            .create(username, password)
            .then((creds) => generateAccessToken(creds.username))
            .then((token) => {
                res.status(201).send({ token: token });
            });
    }
});

router.post("/login", (req: Request, res: Response) => {
    const { username, password } = req.body; // from form

    if (!username || !password) {
        res.status(400).send("Bad request: Invalid input data.");
    } else {
        credentials
            .verify(username, password)
            .then((goodUser: string) => generateAccessToken(goodUser))
            .then((token) => res.status(200).send({ token: token }))
            .catch((error) => res.status(401).send("Unauthorized"));
    }
});

export default router;
