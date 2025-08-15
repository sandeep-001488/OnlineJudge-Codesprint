import rateLimit from "express-rate-limit";

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait 15 minutes before trying again.",
  },
});
