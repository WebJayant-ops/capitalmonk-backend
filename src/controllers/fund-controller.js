import Fund from "../models/fund.js";

// Create or Update Fund for a specific user
const createOrUpdateFund = async (req, res) => {
  const {
    userId,
    accountOpeningDate,
    fundsAllocated,
    fundsAvailableForWithdrawal,
    serviceFeesPaid,
    serviceFeesPayable,
    creditNote,
    NetFeesPayable,
  } = req.body;

  if (
    !userId ||
    !accountOpeningDate ||
    !fundsAllocated ||
    !fundsAvailableForWithdrawal
    // ||
    // !serviceFeesPaid ||
    // !creditNote
  ) {
    return res.status(400).json({
      success: false,
      msg: "Missing required fields: userId, a/c opening date, fundsAvailableForWithdrawal, fundsAllocated, serviceFeesPaid, creditNote",
    });
  }

  const updatedFund = await Fund.findOneAndUpdate(
    { userId }, // Find by userId and pan
    {
      accountOpeningDate,
      fundsAllocated,
      fundsAvailableForWithdrawal,
      serviceFeesPaid,
      serviceFeesPayable,
      creditNote,
      NetFeesPayable,
    },
    {
      new: true, // Return the updated document
      upsert: true, // Create the document if it doesn't exist
      runValidators: true, // Validate the input fields
    }
  );

  res.status(200).json({
    success: true,
    data: updatedFund,
    msg: "Fund record successfully created/updated.",
  });
};

const getFundByUserId = async (req, res) => {
  const { userId } = req.params;

  const fund = await Fund.findOne({ userId }).populate(
    "userId",
    "email username"
  );

  if (!fund) {
    return res.status(404).json({
      success: false,
      msg: "Fund not found for this userId.",
    });
  }

  res.status(200).json({
    success: true,
    data: fund,
    msg: "Fund retrieved successfully.",
  });
};

const deleteFund = async (req, res) => {
  const { userId } = req.params;

  const deletedFund = await Fund.findOneAndDelete({ userId });

  if (!deletedFund) {
    return res.status(404).json({
      success: false,
      msg: "Fund not found for this userId.",
    });
  }

  res.status(200).json({
    success: true,
    msg: "Fund successfully deleted.",
  });
};

export { createOrUpdateFund, getFundByUserId, deleteFund };
