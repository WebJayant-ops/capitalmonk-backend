import Transaction from "../models/transaction.js";

// CREATE_TRANSACTION
export const createTransaction = async (req, res) => {
  const { userId, transactionDate, description, amount } = req.body;

  if (!userId || !transactionDate || !description || !amount) {
    return res.status(400).json({
      success: false,
      msg: "Missing required fields: userId, transactionDate, description, or amount",
    });
  }

  try {
    const transaction = new Transaction({
      userId,
      transactionDate,
      description,
      amount,
    });
    const savedTransaction = await transaction.save();

    res.status(201).json({
      success: true,
      data: savedTransaction,
      msg: "Transaction created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "An error occurred while creating the transaction.",
      error: error.message,
    });
  }
};

// UPDATE_TRANSACTION
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { transactionDate, description, amount } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { transactionDate, description, amount },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        msg: "Transaction not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTransaction,
      msg: "Transaction updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "An error occurred while updating the transaction.",
      error: error.message,
    });
  }
};

// DELETE_TRANSACTION
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        msg: "Transaction not found.",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Transaction deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "An error occurred while deleting the transaction.",
      error: error.message,
    });
  }
};

// GET_TRANSACTIONS_BY_USER_ID
export const getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId }).populate(
      "userId",
      "email username"
    );

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        msg: "No transactions found for this user.",
      });
    }

    const groupedData = transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      const year = transactionDate.getFullYear();
      const month = transactionDate.toLocaleString("default", {
        month: "long",
      });

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }

      acc[year][month].push(transaction);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: groupedData,
      msg: "Transactions retrieved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "An error occurred while retrieving transactions.",
      error: error.message,
    });
  }
};
