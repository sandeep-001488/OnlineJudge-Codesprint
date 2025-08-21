import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../utils/email.js";

export async function registerUser({
  firstName,
  lastName,
  username,
  email,
  password,
}) {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) throw new Error("User already exists");
  if (password.length < 4) {
    throw new Error("Password must be at least 4 characters long");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName: lastName,
    username,
    email,
    password: hashedPassword,
  });

  return {
    id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    username: newUser.username,
    role: newUser.role,
  };
}

export async function loginUser({ identifier, password }) {
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}

export async function updateUserUsername(userId, newUsername) {
  const currentUser = await User.findById(userId);

  if (!currentUser) {
    throw new Error("User not found");
  }

  if (currentUser.hasChangedUsername || currentUser.usernameChangeCount >= 1) {
    throw new Error("You have already changed your username once");
  }

  const existingUser = await User.findOne({
    username: newUsername,
    _id: { $ne: userId },
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      username: newUsername,
      usernameChangeCount: 1,
      hasChangedUsername: true,
    },
    { new: true }
  );

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    role: user.role,
    provider: user.provider,
    picture: user.picture,
    hasChangedUsername: user.hasChangedUsername,
  };
}

export async function checkUsernameExists(username, excludeUserId = null) {
  const query = { username };

  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  const existingUser = await User.findOne(query);
  return !!existingUser;
}

export async function requestPasswordReset({ identifier }) {
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return {
        message:
          "If an account with that email exists, we've sent you a password reset link.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordCode = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.firstName);
    } catch (error) {
      console.error("Email sending error:", error);

      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      throw new Error("Failed to send password reset email. Please try again.");
    }

    return {
      message:
        "If an account with that email exists, we've sent you a password reset link.",
    };
  } catch (error) {
    console.error("Password reset request error:", error);

    if (
      error.message === "Failed to send password reset email. Please try again."
    ) {
      throw error;
    }

    throw new Error("Something went wrong. Please try again later.");
  }
}

export async function resetUserPasswordWithToken({ token, newPassword }) {
  if (!token) {
    throw new Error("Reset token is required");
  }

  const user = await User.findOne({
    resetPasswordCode: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  if (newPassword.length < 4) {
    throw new Error("Password must be at least 4 characters long");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}

export async function resetUserPassword({ identifier, newPassword }) {
  console.warn(
    "DEPRECATED: resetUserPassword is insecure. Use requestPasswordReset + resetUserPasswordWithToken instead"
  );

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) throw new Error("User not found");

  if (newPassword.length < 4) {
    throw new Error("Password must be at least 4 characters long");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}
