import express from "express";
import { Login, LogOut, SignUp } from "../controller/authController.js";
import { verifyUser } from "../middleware/verifyuser.js";

const router = express.Router();

// SignUp Route
router.post("/signUp", SignUp);

// User verification Route
router.get("/verify", verifyUser);

// Login Route
router.post("/login", Login);

// Logout Route
router.post("/logout", LogOut);

// getUser

// router.get("/getUser/:id" , getUser);

export default router;
