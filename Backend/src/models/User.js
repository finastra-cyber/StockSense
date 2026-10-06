import { pool } from "../config/DBconnect2.js";
import bcrypt from "bcryptjs";

// Find user by email
const findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
};

// Find user by id (excludes password)
const findById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

// Create a new user (hashes password before insert)
const createUser = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
  return { id: result.insertId, username, email };
};

const User = { findByEmail, findById, createUser };

export default User;
