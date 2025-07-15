import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export async function registerUser({ username, email, password }) {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) throw new Error("User already exists");
   if (password.length < 4) {
     throw new Error("Password must be at least 4 characters long");
   }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return {
    id: newUser._id,
    email: newUser.email,
    username: newUser.username,
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
    email: user.email,
    username: user.username,
  };
}
