import mongoose, { ConnectionStates } from "mongoose";
import "colors";
import { env } from "@/env";

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState === ConnectionStates.connected) {
      await mongoose.connection.asPromise();
      return;
    }
    await mongoose.connect(env.MONGODB_URI);
    console.log("Database Connection established".green);
  } catch (error) {
    console.log("Error Connecting the Database ~ ".red);
    process.exit();
  }
};

export default dbConnect;
