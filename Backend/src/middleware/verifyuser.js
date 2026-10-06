import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token not found", success: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      if (err) {
        return res.status(400).json({
          message: "JWT Token Verification Error.",
          success: false,
          err,
        });
      }

      const user = await User.findById(data.id);

      if (!user) {
        return res.status(400).json({ message: "User not found in database.", success: false });
      }

      return res.status(200).json({ message: "User found", success: true, user });
    });
  } catch (err) {
    console.log("Token Verification Error: " + err.message);
    return res.status(401).json({ message: "Token Verification Error", success: false });
  }
};
