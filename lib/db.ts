import mongoose from "mongoose"; // Mongoose for MongoDB
const MONGODB_URI = process.env.MONGODB_URI; // DB URI from env

if (!MONGODB_URI) {
  // Check if URI exists
  throw new Error( // Throw error if not
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

const connectDB = async (): Promise<void> => {
  // Connect function
  try {
    // Attempt connection
    await mongoose.connect(MONGODB_URI, {
      // Connect with options
      // Common configuration options
      autoIndex: true, // Useful for development, maybe false in production
    });

    console.log("MongoDB successfully connected."); // Log success
  } catch (error) {
    // Catch error
    console.error("Initial MongoDB connection error:", error); // Log error
    process.exit(1); // Exit process with failure
  }
};

// Monitor connection events for lifecycle management
mongoose.connection.on("error", (err) => {
  // On error
  console.error(`MongoDB connection error: ${err}`); // Log
});

mongoose.connection.on("disconnected", () => {
  // On disconnect
  console.log("MongoDB disconnected"); // Log
});

export default connectDB; // Export function
