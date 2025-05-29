import Instruction from "../models/instruction.js";

// Controller to create or update an instruction
export const createOrUpdateInstruction = async (req, res) => {
  const { instructionForFundWithdrawalPage, instructionForHomePage } = req.body;

  if (!instructionForHomePage || !instructionForFundWithdrawalPage) {
    return res.status(400).json({
      success: false,
      msg: "Missing required fields: instructionForFundWithdrawalPage || instructionForHomePage",
    });
  }

  try {
    // Check if an instruction document already exists (optional: customize if there's only one instruction document)
    const existingInstruction = await Instruction.findOne();

    if (existingInstruction) {
      // Update the existing instruction
      existingInstruction.instructionForFundWithdrawalPage =
        instructionForFundWithdrawalPage;
      existingInstruction.instructionForHomePage = instructionForHomePage;

      const updatedInstruction = await existingInstruction.save();

      return res.status(200).json({
        success: true,
        msg: "Instruction updated successfully",
        data: updatedInstruction,
      });
    }

    // Create a new instruction if none exists
    const newInstruction = await Instruction.create({
      instructionForFundWithdrawalPage,
      instructionForHomePage,
    });

    return res.status(201).json({
      success: true,
      msg: "Instruction created successfully",
      data: newInstruction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// Controller to get an instruction
export const getInstruction = async (req, res) => {
  try {
    const instruction = await Instruction.findOne();

    if (!instruction) {
      return res.status(404).json({
        success: false,
        msg: "Instruction not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: instruction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};
