import jwt from "jsonwebtoken";

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function generateRefreshToken(payload, rememberMe = false) {
  const expiresIn = rememberMe ? "15d" : "7d";
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn,
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
