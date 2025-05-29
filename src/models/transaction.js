import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now, // Defaults to the current date if not provided
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"], // Validates that the amount is non-negative
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
