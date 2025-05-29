import mongoose from "mongoose";
import bcrypt from "bcrypt";

import crypto from "crypto";

// const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes buffer, 256 bits
const ENCRYPTION_KEY = Buffer.from([
  0x2d, 0xe2, 0xbd, 0x13, 0xf1, 0xaf, 0x58, 0x03, 0x88, 0x86, 0xe8, 0xdd, 0xe6,
  0xec, 0xca, 0x0a, 0x67, 0xfd, 0xcf, 0x35, 0xb8, 0x44, 0x10, 0xac, 0x5e, 0x5c,
  0x01, 0x19, 0x37, 0xae, 0xa6, 0x15,
]);
const IV_LENGTH = 16; // AES block size (128 bits)

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  username: {
    type: String,
    trim: true,
  },
  loginId: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  clientId: {
    type: String,
    unique: true,
    // required: true,
  },
  pan: {
    type: String,
    // required: true,
    unique: true,
  },
  bank: {
    type: String,
    // required: [true, "Bank name is required"],
    trim: true,
  },
  branch: {
    type: String,
    // required: [true, "Branch name is required"],
    trim: true,
  },
  ifsc: {
    type: String,
    // required: [true, "IFSC code is required"],
    trim: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code"],
  },
  accountNo: {
    type: String,
    // required: [true, "Account number is required"],
    trim: true,
    unique: true,
  },
});

// Function to encrypt the password
function encryptPassword(password) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Function to decrypt the password
export function decryptPassword(encryptedPassword) {
  const [ivHex, encrypted] = encryptedPassword.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Encrypt the password before saving to the database
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = encryptPassword(this.password);
  }
  next();
});

// Compare the password (admin will use this method)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const decryptedPassword = decryptPassword(this.password);
  return candidatePassword === decryptedPassword;
};

const User = mongoose.model("User", UserSchema);

export default User;
