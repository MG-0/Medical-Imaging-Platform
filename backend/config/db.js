const mongoose = require("mongoose");
const connectDB = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB connected successfully");
      break;
    } catch (error) {
      console.error(`MongoDB connection failed (retries left: ${retries - 1}):`, error.message);
      retries -= 1;
      if (retries === 0) {
        console.error("Failed to connect to MongoDB. The app will stay running but DB operations will fail.");
      } else {
        console.log("Waiting 3 seconds before retrying...");
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }
};
module.exports = connectDB;
