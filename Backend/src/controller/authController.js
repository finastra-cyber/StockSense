import User from "../models/User.js";
import bcrypt from "bcryptjs";
import createSecreteToken from "../utils/SecreteToken.js";

async function SignUp(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exist",
        success: false,
      });
    }

    // Create new user
    const user = await User.createUser({ username, email, password });

    const token = createSecreteToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Sign Up Successfull",
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.log("Signup Error: " + error.message);
    return res.status(500).json({ message: "SignUp Error Occured", success: false });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid Email", success: false });
    }

    // Compare password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Wrong Password", success: false });
    }

    const token = createSecreteToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Don't send password back
    const { password: _, ...safeUser } = user;

    return res.status(200).json({
      message: "User Successfully Login",
      success: true,
      user: safeUser,
      token,
    });
  } catch (error) {
    console.log("Login Error: " + error.message);
    return res.status(500).json({ message: "Login Error Occured", success: false });
  }
}

async function LogOut(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "User Logged Out Successfully", success: true });
  } catch (error) {
    console.log("Logout Error: " + error.message);
    return res.status(500).json({ message: "Logout Error Occured", success: false });
  }
}

export { SignUp, Login, LogOut };
