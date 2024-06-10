var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
    if (!mongoURI) {
        throw new Error('Mongo URI is not defined in the environment variables');
    }
    try {
        yield mongoose.connect(mongoURI, {
        // Add your mongoose connection options here if needed
        });
        console.log(`MongoDB connected: ${mongoURI}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred');
        }
        process.exit(1);
    }
});
export default connectDB;
