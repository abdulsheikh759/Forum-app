import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Database  Connected Successfully");
  } catch (error) {
    console.error("MongoDB Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
