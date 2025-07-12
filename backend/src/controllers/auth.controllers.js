import { loginUser, registerUser } from "../services/auth.service.js";

export async function Signup(req, res) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User is created successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


export async function Login(req, res) {
  try {
    const user = await loginUser(req.body);
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
