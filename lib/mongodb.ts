

import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");
};

export default connectDB;
