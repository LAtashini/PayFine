import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log success when connected
    console.log("MongoDB connected successfully");

  } catch (error) {
    // Catch any connection errors and log them
    console.log("MongoDB connection failed", error);
  }
}

export default connectDB;
