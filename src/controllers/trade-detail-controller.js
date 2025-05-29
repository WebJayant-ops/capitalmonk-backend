import TradeDetail from "../models/tradeDetail.js";

export const getAllTradeDetails = async (req, res) => {
  const tradeDetails = await TradeDetail.find().populate(
    "userId",
    "email username"
  );

  res.status(200).json({
    success: true,
    data: tradeDetails,
    msg: "All trade details retrieved successfully.",
  });
};

// CREATE_TRADE_DETAIL

export const createTradeDetail = async (req, res) => {
  const { userId, tradedDate, stockName, amount } = req.body;

  if (!userId || !stockName || !amount) {
    return res.status(400).json({
      success: false,
      msg: "Missing required fields: userId, stockName, or amount",
    });
  }

  const tradeDetail = new TradeDetail({
    userId,
    tradedDate,
    stockName,
    amount,
  });
  const savedTradeDetail = await tradeDetail.save();

  res.status(201).json({
    success: true,
    data: savedTradeDetail,
    msg: "Trade detail created successfully.",
  });
};

// UPDATE_TRADE_DETAIL_BY_TRADE_ID

export const updateTradeDetail = async (req, res) => {
  const { id } = req.params;
  const { tradedDate, stockName, amount } = req.body;

  const updatedTradeDetail = await TradeDetail.findByIdAndUpdate(
    id,
    { tradedDate, stockName, amount },
    { new: true, runValidators: true } // Return updated document and validate fields
  );

  if (!updatedTradeDetail) {
    return res.status(404).json({
      success: false,
      msg: "Trade detail not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: updatedTradeDetail,
    msg: "Trade detail updated successfully.",
  });
};

// DELETE_TRADE_DETAIL_BY_TRADE_ID

export const deleteTradeDetail = async (req, res) => {
  const { id } = req.params;

  const deletedTradeDetail = await TradeDetail.findByIdAndDelete(id);

  if (!deletedTradeDetail) {
    return res.status(404).json({
      success: false,
      msg: "Trade detail not found.",
    });
  }

  res.status(200).json({
    success: true,
    msg: "Trade detail deleted successfully.",
  });
};

// GET_TRADE_DETAIL_BY_USER_ID

export const getTradeDetailsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch trade details for the given user
    const tradeDetails = await TradeDetail.find({ userId }).populate(
      "userId",
      "email username"
    );

    // If no trade details found, return a 404 response
    if (!tradeDetails.length) {
      return res.status(404).json({
        success: false,
        msg: "No trade details found for this user.",
      });
    }

    // Group data by year and month
    const groupedData = tradeDetails.reduce((acc, trade) => {
      const tradedDate = new Date(trade.tradedDate);
      const year = tradedDate.getFullYear();
      const month = tradedDate.toLocaleString("default", { month: "long" });

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }

      acc[year][month].push(trade);
      return acc;
    }, {});

    // Respond with the grouped data
    res.status(200).json({
      success: true,
      data: groupedData,
      msg: "Trade details retrieved successfully.",
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      msg: "An error occurred while retrieving trade details.",
      error: error.message,
    });
  }
};
