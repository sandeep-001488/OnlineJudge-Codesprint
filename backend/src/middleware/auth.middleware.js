import { verifyToken } from "../../utils/jwt";

const middleware = async (req, res, next) => {
  const header = req.header.authorization;
  if (!header || !header.startswith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { middleware as authMiddleware };
