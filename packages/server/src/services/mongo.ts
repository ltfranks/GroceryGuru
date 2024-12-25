// @ts-ignore
import dotenv from "dotenv";
// @ts-ignore
import mongoose from "mongoose";

mongoose.set("debug", true);
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
console.log("Environment Variables:");
console.log("MONGO_USER:", process.env.MONGO_USER);
console.log("MONGO_PWD:", process.env.MONGO_PWD ? "****" : "Not Set");
console.log("MONGO_CLUSTER:", process.env.MONGO_CLUSTER);

function getMongoURI(dbname: string) {
    let connection_string = `mongodb://localhost:27017/${dbname}`;
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;

    if (MONGO_USER && MONGO_PWD && MONGO_CLUSTER) {
        console.log(
            "Connecting to MongoDB at",
            `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${dbname}`
        );
        connection_string = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${dbname}?retryWrites=true&w=majority`;
    } else {
        console.log("Connecting to MongoDB at ", connection_string);
    }
    return connection_string;
}

export function connect(dbname: string) {
    mongoose
        .connect(getMongoURI(dbname))
        .catch((error: any) => console.log(error));
}