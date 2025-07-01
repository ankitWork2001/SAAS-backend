import mongoose from "mongoose";
const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceMonthly: { type: Number, required: true }, // should be in cents
  priceYearly: { type: Number, required: false }, // should be in cents
  isAvailable: {type: Boolean, default: true},  // whether the plan is available for purchase or blocked by admin 
  features: [String], // e.g. ['real-time data', 'signals', 'AI insights']
});

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
