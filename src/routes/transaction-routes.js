import express from "express";
import {
  createTransaction,
  getTransactionsByUserId,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction-controller.js";

const TransactionRouter = express.Router();

TransactionRouter.route("/").post(createTransaction);

TransactionRouter.route("/user/:userId").get(getTransactionsByUserId);

TransactionRouter.route("/:id")
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default TransactionRouter;
