import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI).then((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};
