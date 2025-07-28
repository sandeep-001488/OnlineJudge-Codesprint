import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is required"],
      minlength: [3, "FirstName must be at least 3 characters long"],
      trim: true,
    },
    lastName: {
      type: String,
      minlength: [3, "LastName must be at least 3 characters long"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    role: {
      type: [String],
      enum: ["user", "admin", "problemSetter"],
      default: ["user"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters long"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model.User || mongoose.model("User", userSchema);
export default User;
