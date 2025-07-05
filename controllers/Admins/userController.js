import User from "../../models/User.js";

export const allUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

export const blockUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userID,
      { status: "blocked" },
      { new: true, runValidators: false }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "User blocked successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};


export const activateBlockedUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userID,
      { status: "ownActive" },
      { new: true, runValidators: false }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "User activated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};