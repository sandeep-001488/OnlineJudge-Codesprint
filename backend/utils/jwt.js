import jwt from "jsonwebtoken";

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m", 
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token, isRefresh = false) {
  const secret = isRefresh
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_SECRET;

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
