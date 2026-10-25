import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function createSecreteToken(id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );
}
