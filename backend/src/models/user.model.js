import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"; 

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
      required: function () {
        return this.provider === "local" || !this.provider;
      },
      minlength: [4, "Password must be at least 4 characters long"],
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    picture: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordCode: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    usernameChangeCount: {
      type: Number,
      default: 0,
      max: 1,
    },
    hasChangedUsername: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.provider === "google" && !this.isEmailVerified) {
    this.isEmailVerified = true;
  }

  if (this.provider === "google" && !this.password) {
    this.password = `google_oauth_${this.googleId}_${Date.now()}`;
  }

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});


userSchema.methods.isGoogleUser = function () {
  return this.provider === "google" && this.googleId;
};

userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName || ""}`.trim();
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
