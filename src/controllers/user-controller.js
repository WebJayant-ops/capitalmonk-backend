import User, { decryptPassword } from "../models/user.js";
import Fund from "../models/fund.js";
import TradeDetail from "../models/tradeDetail.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { mailTransporter } from "../utils/mailTransport.js";

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" });

  const userCount = users.length;

  res.status(200).json({
    success: true,
    count: userCount,
    data: users,
    msg: "Successfully retrieved all users.",
  });
};

const getUserByID = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, msg: "Invalid User ID" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: user,
    msg: "Successfully retrieved user.",
  });
};

const updateProfile = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, msg: "Invalid User ID" });
  }

  const updatedProfile = req.body;

  const user = await User.findByIdAndUpdate(userId, updatedProfile, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: user,
    msg: "Profile successfully updated.",
  });
};

const createUser = async (req, res) => {
  const { email, phoneNumber, username } = req.body;

  if (!email || !phoneNumber || !username) {
    return res.status(400).json({
      success: false,
      msg: "Email, phone number, and username are required.",
    });
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      msg: "A user with this email already exists.",
    });
  }

  // Generate a random password
  const password = crypto.randomBytes(4).toString("hex"); // 16-character password

  // Generate a unique loginId
  const loginId = `CMT-${crypto.randomBytes(2).toString("hex")}`;

  // Create a new user
  const newUser = await User.create({
    password,
    loginId,
    ...req.body,
  });

  const mailOptions = {
    from: "info@Capitalmonks.com",
    to: email,
    // bcc: ["divucloud@gmail.com"], // in production we will have to remove this line
    subject:
      "Confirmation of Account Activation & Login Details - Capital Monk",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #003366; text-align: center; margin-bottom: 20px;">Capital Monk</h2>
        <p style="font-size: 16px; color: #333333;">Dear ${username},</p>

        <p style="font-size: 16px; color: #333333;">
          We are pleased to inform you that your prop trading account (Client Code: <span style="color: #003366;">${loginId}</span>) has been successfully activated.
        </p>
        <p style="font-size: 16px; color: #333333;">
          Please find your login credentials below to access your account:
        </p>

        <ul style="font-size: 16px; color: #333333; list-style-type: disc; margin-left: 20px;">
          <li>Login ID: <span style="color: #003366;">${loginId}</span></li>
          <li>Password: <span style="color: #003366;">${password}</span></li>
        </ul>

        <p style="font-size: 16px; color: #333333;">
          You can access your account by clicking the link below:
        </p>

        <p style="text-align: center; margin: 20px 0;">
          <a href="https://capitalmonks.com/login" style="font-size: 16px; color: #ffffff; text-decoration: none; padding: 10px 20px; background-color: #003366; border-radius: 5px; display: inline-block;">
            Login to Your Account
          </a>
        </p>

        <p style="font-size: 16px; color: #333333;">
          If you have any questions or need assistance, feel free to reach out to our support team. We are here to help you with any inquiries you may have.
        </p>
      
        <p style="font-size: 16px; color: #333333;">
          Thank you for choosing CapitalMonks. We look forward to supporting your trading journey.
        </p>

        <p style="font-size: 16px; color: #333333;">Best regards, <br><span style="color: #003366;">The CapitalMonks Team</span></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #666666; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
`,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "There was an error sending the creation email.",
    });
  }
  res.status(201).json({
    success: true,
    data: {
      ...newUser,
    },
    msg: "User successfully created. Password has been generated.",
  });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, msg: "Invalid User ID" });
  }

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  // Delete associated data
  await Fund.deleteMany({ userId }); // Deletes all funds associated with the user
  await TradeDetail.deleteMany({ userId }); // Deletes all trade details associated with the user

  // Delete the user
  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    msg: "User and all associated data successfully deleted.",
  });
};

const getUserPassword = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      msg: "User ID is required.",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: "User not found.",
    });
  }

  const decryptedPassword = decryptPassword(user.password);

  res.status(200).json({
    success: true,
    data: decryptedPassword,
  });
};

const withDrawFund = async (req, res) => {
  const { userId } = req.params;
  const { amount, accountNo, username, clientId, email, phoneNumber } =
    req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      msg: "User is not found",
      status: 404,
    });
  }

  const mailOptions = {
    from: "info@Capitalmonks.com",
    to: [
      "Tradeawasthi@gmail.com",
      "jigarseth703@gmail.com",
      "info@Capitalmonks.com",
    ],
    // bcc: ["divucloud@gmail.com"], // in production we will have to remove this line
    subject: "Request for Money Withdrawal - Capital Monk",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #003366; text-align: center; margin-bottom: 20px;">Capital Monk</h2>
        <p style="font-size: 16px; color: #333333;">Dear Capitalmonk's admin team,</p>
    
        <p style="font-size: 16px; color: #333333;">
          Requesting withdrawal of RS <strong style="color: #003366;">INR ${amount}</strong>
        </p>
    
        <p style="font-size: 16px; color: #333333;">
          For your reference, my details are as follows:
        </p>
        <ul style="font-size: 16px; color: #333333; list-style-type: disc; margin-left: 20px;">
          <li>User ID: <span style="color: #003366;">${clientId}</span></li>
          <li>Phone Number: <span style="color: #003366;">${phoneNumber}</span></li>
          <li>Email Address: <span style="color: #003366;">${email}</span></li>
        </ul>
    
        <p style="font-size: 16px; color: #333333;">
          Please process this request at your earliest convenience. Let me know if any additional documentation or information is required.
        </p>
      
        <p style="font-size: 16px; color: #333333;">
          Thank you for your assistance. I look forward to your confirmation.
        </p>
    
        <p style="font-size: 16px; color: #333333;">Best regards, <br><span style="color: #003366;">${username}</span></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #666666; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await mailTransporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      msg: "Request is sent to the admin.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to send request to the admin.",
      error,
    });
  }
};

export {
  getAllUsers,
  getUserByID,
  updateProfile,
  createUser,
  deleteUser,
  getUserPassword,
  withDrawFund,
};
