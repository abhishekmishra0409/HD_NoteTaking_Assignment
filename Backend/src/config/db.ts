import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure that the environment variable is defined
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
export default connectDB;