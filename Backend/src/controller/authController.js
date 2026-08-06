import User from "../models/User.js";
import bcrypt from "bcryptjs";
import createSecreteToken from "../utils/SecreteToken.js";

async function SignUp(req, res) {
  try {
    // get the data from the req body
    const { username, email, password } = req.body;

    // check the user alredy exist of not
    const existinguser = await User.findOne({ email });

    // if user alredy exit then return
    if (existinguser) {
      return res.status(400).json({
        message: "User Already Exist",
        success: false,
        user: existinguser,
      });
    }

    // const imageUrl = req.file.path;

    // console.log(imageUrl);

    // now if the user is not exit then create the new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Creating a token for new user
    const token = createSecreteToken(user._id);

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
      user: user,
      token: token,
    });
  } catch (error) {
    console.log("Signup Error: " + error.message);
    return res
      .status(500)
      .json({ message: "SignUp Error Occured", success: false });
  }
}

async function Login(req, res) {
  try {
    // get the data from the req body
    const { email, password } = req.body;

    // check the user alredy exist of not
    const user = await User.findOne({ email });

    // if user not exit then return
    if (!user) {
      return res.status(400).json({ message: "Invalid Email", success: false });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res
        .status(400)
        .json({ message: "Wrong Password", success: false });
    }

    // Creating a token for new user
    const token = createSecreteToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User Successfully Login",
      success: true,
      user: user,
      token: token,
    });
  } catch (error) {
    console.log("Login Error : " + error.message);
    return res
      .status(500)
      .json({ message: "Login Error Occured", success: false });
  }
}

async function LogOut(req, res) {
  try {
    // Remove the Cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      // expires: new Date(0),
    });

    return res
      .status(200)
      .json({ message: "User Logged Out Successfully", success: true });
  } catch (error) {
    console.log("Logout Error Occured: " + error.message);
    res.status(500).json({
      message: "Logout Error Occured",
      Error: error.message,
      success: false,
    });
  }
}

export { SignUp, Login, LogOut };
