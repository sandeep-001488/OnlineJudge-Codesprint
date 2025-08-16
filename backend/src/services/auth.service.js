import bcrypt from "bcrypt";
import User from "../models/user.model.js";

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

export async function resetUserPassword({ identifier, newPassword }) {
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