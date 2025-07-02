import crypto from "crypto";
import { sendEmail } from "./sendEmail.js";

// In-memory store (consider Redis or DB with TTL in production)
export const otpStore = new Map();

/**
 * Generates and sends an OTP to user's email
 * @param {string} email
 * @returns {string} The OTP
 */
export const requestEmailOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 20 minutes

  otpStore.set(email, { otp, expiresAt });

  const html = `
    <div style="font-family: sans-serif; color: #333;">
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h3 style="color: #4CAF50;">${otp}</h3>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    text: `Your OTP is ${otp}. Valid for 10 minutes.`,
    html,
  });

  return otp;
};

/**
 * Verifies a given OTP for an email
 * @param {string} email
 * @param {string} enteredOtp
 * @returns {boolean} true if valid
 */
export const verifyEmailOTP = (email, enteredOtp) => {
  const stored = otpStore.get(email);
  if (!stored) return false;

  const { otp, expiresAt } = stored;
  const now = Date.now();

  if (now > expiresAt) {
    otpStore.delete(email);
    return false;
  }

  const isValid = otp === enteredOtp;
  if (isValid) otpStore.delete(email);
  return isValid;
};
