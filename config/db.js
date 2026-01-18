import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // 1. Logic to pick the right URI
    const dbURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGO_URI_TEST 
      : process.env.MONGO_URI;

    // 2. Log which one we are connecting to (helpful for debugging!)
    const mode = process.env.NODE_ENV === 'test' ? "TEST (Cloud)" : "DEVELOPMENT (Local)";
    
    const conn = await mongoose.connect(dbURI);
    
    console.log(`MongoDB Connected to ${mode}: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Only kill the process if we are running the actual server.
    // In tests, we want Jest to stay alive to show us the report.
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

export default connectDB;
