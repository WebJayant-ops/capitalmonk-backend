import mongoose from "mongoose";

const instructionSchema = new mongoose.Schema(
  {
    instructionForFundWithdrawalPage: {
      type: String,
      required: true,
      trim: true,
    },
    instructionForHomePage: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Instruction = mongoose.model("Instruction", instructionSchema);

export default Instruction;
