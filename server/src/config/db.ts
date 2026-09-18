import mongoose from "mongoose";

export const connectToDB = async (mongoURI: string) => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Database connected");
        mongoose.connection.on("disconnected", () => console.log("Database disconnected"));
        mongoose.connection.on("error", (error) => console.log("MongoDB Error:", error));
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }
        process.exit(1);
    }
}