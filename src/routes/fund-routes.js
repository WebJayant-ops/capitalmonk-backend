import express from "express";
import {
  createOrUpdateFund,
  getFundByUserId,
  deleteFund,
} from "../controllers/fund-controller.js";

const FundRouter = express.Router();

FundRouter.route("/createOrUpdate").post(createOrUpdateFund);
FundRouter.route("/:userId").get(getFundByUserId).delete(deleteFund);

export default FundRouter;
