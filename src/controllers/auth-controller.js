import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";
import { mailTransporter } from "../utils/mailTransport.js";
import crypto from "crypto";

// const login = async (req, res) => {
//   const { loginId, password } = req.body;

//   if (!loginId || !password) {
//     return res.status(400).json({
//       success: false,
//       msg: "Please provide both loginId and password.",
//     });
//   }

//   // Find user by loginId instead of email
//   const user = await User.findOne({ loginId });

//   if (!user) {
//     return res.status(400).json({
//       success: false,
//       msg: "There is no user exist with this loginId.",
//     });
//   }

//   // Compare the provided password with the stored hashed password
//   const isPasswordValid = await user.comparePassword(password);

//   if (isPasswordValid) {
//     // Generate token after successful login
//     const token = generateToken(user);

//     return res.status(201).json({
//       success: true,
//       msg: "Successfully logged in",
//       data: user,
//       accessToken: token,
//     });
//   }

//   return res.status(400).json({
//     success: false,
//     msg: "Password is incorrect.",
//   });
// };

const login = async (req, res) => {
  const { loginId, password, role } = req.body;

  // Check if all required fields are provided
  if (!loginId || !password || !role) {
    return res.status(400).json({
      success: false,
      msg: "Please provide loginId, password, and role.",
    });
  }

  // Find user by loginId
  const user = await User.findOne({ loginId });

  // Check if the user exists and has the correct role
  if (!user || user.role !== role) {
    return res.status(400).json({
      success: false,
      msg: `No user exists with this loginId and (${role}) role.`,
    });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await user.comparePassword(password);

  if (isPasswordValid) {
    // Generate token after successful login
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      msg: "Successfully logged in",
      data: user,
      accessToken: token,
    });
  }

  return res.status(400).json({
    success: false,
    msg: "Password is incorrect.",
  });
};

const otpMap = new Map();

const generateOTP = (email) => {
  const length = 6;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  otpMap.set(email, otp);
  return otp;
};

const verifyOTP = (email, otp) => {
  const storedOTP = otpMap.get(email);

  return otp === storedOTP;
};

const resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      msg: "Please provide email, OTP, and a new password.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: "User with this email is not found" });
  }

  const isOTPValid = verifyOTP(email, otp);

  if (!isOTPValid) {
    return res.status(400).json({ success: false, msg: "Invalid OTP" });
  }

  user.password = newPassword;
  await user.save();

  otpMap.delete(email);

  res.status(200).json({ success: true, msg: "Password reset successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: "User with this email is not found",
      status: 404,
    });
  }

  const otp = generateOTP(email);

  const mailOptions = {
    from: "info@Capitalmonks.com",
    to: email,
    subject: "Password Reset Request - Capital Monk",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #003366; text-align: center; margin-bottom: 20px;">Capital Monk</h2>
        <p style="font-size: 16px; color: #333333;">Hello,</p>
        <p style="font-size: 16px; color: #333333;">
          We received a request to reset your password for the <strong>Capital Monk</strong> app. Use the OTP below to proceed:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #ffffff; background-color: #003366; padding: 15px 30px; border-radius: 5px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 16px; color: #333333;">
          If you did not request this password reset, please ignore this email. Your account will remain secure.
        </p>
        <p style="font-size: 16px; color: #333333;">Thank you, <br> The <span style="color: #003366;">Capital Monk</span> Team</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #666666; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  await mailTransporter.sendMail(mailOptions);

  res
    .status(200)
    .json({ success: true, msg: "OTP send successfully to your email" });
};

export { login, resetPassword, forgotPassword };
