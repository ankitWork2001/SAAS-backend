import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user", "ownAdmin"], default: "user" },
    status: {
      type: String,
      enum: ["ownActive", "blocked"],
      default: "ownActive",
    },
    isEmailVerified: { type: Boolean, default: false },
    loginProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    subscription: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Subscription",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
