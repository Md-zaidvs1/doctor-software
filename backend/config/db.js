const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://localhost:27017/dental";

    await mongoose.connect(MONGO_URI);

    console.log("💾 Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;