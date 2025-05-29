import express from "express";
import {
  createTradeDetail,
  getAllTradeDetails,
  getTradeDetailsByUserId,
  updateTradeDetail,
  deleteTradeDetail,
} from "../controllers/trade-detail-controller.js";

const TradeDetailRouter = express.Router();

TradeDetailRouter.route("/")
  .post(createTradeDetail) // Create a new trade detail
  .get(getAllTradeDetails); // Get all trade details

TradeDetailRouter.route("/user/:userId").get(getTradeDetailsByUserId);

TradeDetailRouter.route("/:id")
  .patch(updateTradeDetail)
  .delete(deleteTradeDetail);

export default TradeDetailRouter;
