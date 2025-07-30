import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";


export const viewAllAvailablePlans = async (req,res) => {

};

export const viewPlanById = async (req,res) => {

};


export const addPlanToUser = async (req,res) => {

};


export const subscribedPlansOfUser = async (req,res) => {

};


export const allActivePlansOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const subscriptions = await Subscription.find({
      user: userId,
      status: "active",
    })
      .populate("Plan")
      .populate("Product");

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active plans",
      error: error.message,
    });
  }
};


export const allPlansOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const subscriptions = await Subscription.find({
      user: userId
    })
      .populate("Plan")
      .populate("Product");

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active plans",
      error: error.message,
    });
  }
};