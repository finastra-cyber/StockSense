import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Found",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error finding user: " + error.message);
    return res.status(500).json({
      message: "Error finding the user",
      success: false,
    });
  }
};
