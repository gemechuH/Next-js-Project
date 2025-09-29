import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL as string;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let isConnected = false; // to prevent multiple connections

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
