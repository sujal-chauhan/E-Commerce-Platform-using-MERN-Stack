import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURL = process.env.MONGO_URL || '';

    if (!mongoURL) {
      console.error('MONGO_URI is not defined in environment variables');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to DB: ", error);
    process.exit(1);
  }
};

export default connectDB; 