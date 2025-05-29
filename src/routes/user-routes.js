import express from "express";
import {
  getAllUsers,
  getUserByID,
  updateProfile,
  createUser,
  deleteUser,
  getUserPassword,
  withDrawFund,
} from "../controllers/user-controller.js";
import authenticateMiddleware from "../middlewares/authenticated-middleware.js";

const UserRouter = express.Router();

UserRouter.route("/").get(authenticateMiddleware, getAllUsers);
UserRouter.route("/:id")
  .get(authenticateMiddleware, getUserByID)
  .delete(deleteUser);
UserRouter.route("/:id/updateProfile").patch(
  authenticateMiddleware,
  updateProfile
);
UserRouter.route("/getUserPassword/:userId").get(
  authenticateMiddleware,
  getUserPassword
);

UserRouter.route("/createUser").post(createUser);

UserRouter.route("/withdrawFund/:userId").post(
  authenticateMiddleware,
  withDrawFund
);

export default UserRouter;
