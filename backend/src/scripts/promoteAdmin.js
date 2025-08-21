import mongoose from "mongoose";
import User from "../models/user.model.js";
import dotenv from "dotenv"

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

const adminUsername = process.env.ADMIN_USERNAME;
if (!adminUsername) {
  console.error("ADMIN_EMAIL is not defined in .env");
  process.exit(1);
}

const result = await User.updateOne(
  { username: adminUsername },
  {
    $addToSet: {
      role: { $each: ["admin", "problemSetter"] },
    },
  }
);

if (result.modifiedCount > 0) {
  console.log(`Admin and ProblemSetter roles assigned to ${adminUsername}`);
} else {
  console.log(`No changes made. User may already have the roles or not found.`);
}

process.exit();
