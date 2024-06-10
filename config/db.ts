import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
  
  if (!mongoURI) {
    throw new Error('Mongo URI is not defined in the environment variables');
  }

  try {
    await mongoose.connect(mongoURI, {
      // Add your mongoose connection options here if needed
    });
    console.log(`MongoDB connected: ${mongoURI}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
};

export default connectDB;
