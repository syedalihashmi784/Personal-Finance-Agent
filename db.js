import mongoose from "mongoose";
import { DB_URL } from './config/index.js';

export const connectDB = async () => {
        await mongoose.connect(DB_URL);
}
