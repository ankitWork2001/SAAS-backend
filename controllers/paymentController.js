import { razorpay } from "../utils/razorpay";
import crypto from "crypto";
import Plan from "../models/plan.model";
import User from "../models/user.model";
import Subscription from "../models/subscription.model";

export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const { userId } = req.user;

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

    const newSub = new Subscription({
      userId,
      planId,
      razorpayOrderId: order.id,
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
