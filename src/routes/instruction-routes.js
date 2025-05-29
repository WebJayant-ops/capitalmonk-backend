import express from "express";
import {
  createOrUpdateInstruction,
  getInstruction,
} from "../controllers/instruction-controller.js";

const InstructionRouter = express.Router();

InstructionRouter.route("/").post(createOrUpdateInstruction);
InstructionRouter.route("/").get(getInstruction);

export default InstructionRouter;
