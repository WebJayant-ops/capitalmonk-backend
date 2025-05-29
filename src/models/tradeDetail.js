import mongoose from "mongoose";

const tradeDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    tradedDate: {
      type: Date,
      required: true,
      default: Date.now, // Defaults to the current date if not provided
    },
    stockName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"], // Validates that the amount is non-negative
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const TradeDetail = mongoose.model("TradeDetail", tradeDetailSchema);

export default TradeDetail;
