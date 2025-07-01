import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    isAdmin: {type: Boolean, default: false},
    isBlocked: {type: Boolean, default: false},  // whether the user is able to purchase or blocked by admin 

    isEmailVerified: { type: Boolean, default: false },
    loginProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    subscription: {
      type: [mongoose.Schema.Types.ObjectId],   // array of subscriptions 
      ref: "Subscription",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
