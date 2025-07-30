import User from "../../models/User.js";
import Subscription from "../../models/Subscription.js";
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

export const dashboardView = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.role === "ownAdmin")
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const totalUsers = await User.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const totalRevenueResult = await Subscription.aggregate([
      {
        $match: { status: "active" },
      },
      {
        $lookup: {
          from: "plans",
          localField: "plan",
          foreignField: "_id",
          as: "planDetails",
        },
      },
      {
        $unwind: "$planDetails",
      },
      {
        $addFields: {
          durationInDays: {
            $divide: [
              { $subtract: ["$endDate", "$startDate"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$planDetails.priceYearly", null] },
                  { $ne: ["$planDetails.priceYearly", undefined] },
                  { $gte: ["$durationInDays", 360] },
                ],
              },
              then: "$planDetails.priceYearly",
              else: "$planDetails.priceMonthly",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$effectivePrice",
          },
        },
      },
    ]);

    const totalSubscriptionValue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].totalAmount : 0;

    res.status(200).json({
      success: true,
      totalUsers,
      totalSubscriptions,
      totalrevenue: totalSubscriptionValue,
      recentUsers,
      // user,
    });
  } catch (err) {
    console.error("Dashboard View Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};