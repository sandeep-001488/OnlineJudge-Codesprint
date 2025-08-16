import {
  loginUser,
  registerUser,
  resetUserPassword,
  updateUserUsername,
  checkUsernameExists,
} from "../services/auth.service.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/jwt.js";
import User from "../models/user.model.js";
import axios from "axios";


export async function GoogleCallback(req, res) {
  try {

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        message: "Authorization code is required",
        error: "missing_code",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("Missing Google OAuth credentials");
      return res.status(500).json({
        message: "Server configuration error",
        error: "missing_credentials",
      });
    }

    const redirectUri =
      req.body.redirect_uri ||
      `${process.env.FRONTEND_URL}/auth/google/callback`;

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      console.error("No access token received");
      return res.status(400).json({
        message: "Failed to get access token",
        error: "no_access_token",
      });
    }

    const userInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const {
      email,
      name,
      given_name,
      family_name,
      id: googleId,
      picture,
    } = userInfoResponse.data;

    if (!email || !googleId) {
      return res.status(400).json({
        message: "Email and Google ID required from Google response",
        error: "incomplete_user_data",
      });
    }

    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    console.log(
      "User lookup result:",
      user ? "Found existing user" : "No existing user"
    );

    if (!user) {
      const firstName = given_name || name?.split(" ")[0] || "User";
      const lastName = family_name || name?.split(" ").slice(1).join(" ") || "";

      let baseUsername = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter++}`;
      }

      try {
        user = await User.create({
          firstName,
          lastName,
          username,
          email,
          googleId,
          picture,
          password: `google_oauth_${googleId}_${Date.now()}`,
          role: ["user"],
          provider: "google",
          isEmailVerified: true,
          lastActive: new Date(),
        });

      } catch (createError) {
        if (createError.code === 11000) {
          console.log(
            "Duplicate key error during creation, trying to find existing user..."
          );

        
          user = await User.findOne({ email });

          if (!user) {
            throw new Error(
              "Failed to create or find user after duplicate key error"
            );
          }

         
          if (!user.googleId) {
            user.googleId = googleId;
            user.picture = picture || user.picture;
            user.provider = user.provider || "local"; 
            user.isEmailVerified = true;
            user.lastActive = new Date();
            await user.save();
           
          }
        } else {
          throw createError;
        }
      }
    } else {
     
      if (!user.googleId && user.provider !== "google") {
        user.googleId = googleId;
        user.provider = "google"; 
      }

      user.picture = picture || user.picture;
      user.isEmailVerified = true;
      user.lastActive = new Date();

      try {
        await user.save();
      } catch (saveError) {
        console.error("Error saving existing user:", saveError);
      }
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    const refreshToken = generateRefreshToken(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      true
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      success: true,
      message: "Google login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        picture: user.picture,
        role: user.role,
        provider: user.provider || "google",
      },
    });
  } catch (error) {
    console.error("Google callback error:", error);

    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);

      if (error.response.status === 400) {
        return res.status(400).json({
          message: "Invalid authorization code or expired",
          error: "invalid_code",
          details: error.response.data,
        });
      }
    }

    res.status(500).json({
      message: "Google authentication failed",
      error: "internal_error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
export async function Signup(req, res) {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(400).json({ message: error.message });
  }
}
export async function Login(req, res) {
  try {
    const user = await loginUser(req.body);

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });
    const refreshToken = generateRefreshToken(
      {
        id: user.id,
        role: user.role,
      },
      req.body.rememberMe
    ); 

    res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function UpdateUsernameController(req, res) {
  try {
    const { newUsername } = req.body;
    const userId = req.user.id;

    if (!newUsername) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const updatedUser = await updateUserUsername(userId, newUsername);

    res.status(200).json({
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.message === "You have already changed your username once") {
      return res.status(400).json({
        message: error.message,
        error: "username_change_limit_reached",
      });
    }

    if (error.message === "Username already exists") {
      return res.status(400).json({
        message: error.message,
        error: "username_taken",
      });
    }

    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: "Failed to update username",
      error: "internal_error",
    });
  }
}

export async function CheckUsernameController(req, res) {
  try {
    const { username } = req.params;
    const userId = req.user?.id; 

    const exists = await checkUsernameExists(username, userId);

    res.status(200).json({
      available: !exists,
      message: exists ? "Username already taken" : "Username is available"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function ResetPassword(req, res) {
  try {
    const { identifier, newPassword } = req.body;

    if (!identifier || !newPassword) {
      return res.status(400).json({
        message: "Identifier and new password are required",
      });
    }

    const user = await resetUserPassword({ identifier, newPassword });

    res.status(200).json({
      message: "Password reset successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function GetMe(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function RefreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = verifyToken(refreshToken, true);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: user.role, 
    });

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}
