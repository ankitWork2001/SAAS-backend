import Plan from "../models/Plan.js";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";

// View all available plans
export const viewAllAvailablePlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plans", error });
  }
};

// View a plan by ID
export const viewPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plan", error });
  }
};

// Add a plan to a user (create a subscription)
export const addPlanToUser = async (req, res) => {
  try {
    const { userId, planId, productId, startDate, endDate } = req.body;

    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user || !plan) {
      return res.status(404).json({ message: "User or Plan not found" });
    }

    const alreadySubscribed = await Subscription.findOne({
      user: userId,
      plan: planId,
      status: "active",
    });

    if (alreadySubscribed) {
      return res
        .status(400)
        .json({ message: "User is already subscribed to this plan" });
    }

    const newSubscription = await Subscription.create({
      user: userId,
      plan: planId,
      product: productId,
      startDate,
      endDate,
    });

    user.subscription.push(newSubscription._id);
    await user.save();

    res.status(200).json({
      message: "Plan added to user successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding plan to user", error });
  }
};

// Get all subscribed plans of a user (with populated plan & product)
export const subscribedPlansOfUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "subscription",
      populate: [
        { path: "plan", model: "Plan" },
        { path: "product", model: "Product" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.subscription);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user's subscribed plans",
      error,
    });
  }
};
