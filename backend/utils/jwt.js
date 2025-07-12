import jwt from "jsonwebtoken";

export async function generateToken(params) {
  const token = jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}

export async function verifyToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}
