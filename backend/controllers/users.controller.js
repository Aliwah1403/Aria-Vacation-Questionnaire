import mongoose from "mongoose";

export const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Debug logging
    console.log("Received userId:", userId);

    const db = mongoose.connection.db;
    const User = db.collection("user");

    // Query user by _id field using ObjectId
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};
