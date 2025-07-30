import { razorpay } from "../utils/razorpay.js";
import crypto from "crypto";
import Plan from "../models/Plan.js";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";

export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingSub = await Subscription.findOne({ userId, planId });
    if (existingSub)
      return res.status(400).json({ message: "Already subscribed" });

    const order = await razorpay.orders.create({
      amount: plan.priceMonthly * 100, //amount in cents
      currency: "USD",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    // Date logic
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month validity

    const newSub = new Subscription({
      user: userId,
      plan: planId,
      razorpayOrderId: order.id,
      startDate,
      endDate,
    });

    await newSub.save();

    return res
      .status(200)
      .json({ order, message: "Order created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (sign === razorpay_signature) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewUserOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Subscription.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user payment history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchOwnOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await Subscription.findOne({ userId, razorpayOrderId: orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching own order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};