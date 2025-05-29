import mongoose from "mongoose";

const fundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: true,
    },
    accountOpeningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    fundsAllocated: {
      type: Number,
      required: true,
      min: 0,
    },
    fundsAvailableForWithdrawal: {
      type: Number,
      required: true,
      min: 0,
    },
    serviceFeesPaid: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    creditNote: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    serviceFeesPayable: {
      type: Number,
      default: 0,
      min: 0,
    },
    NetFeesPayable: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Fund = mongoose.model("Fund", fundSchema);

export default Fund;
