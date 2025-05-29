import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
} from "../controllers/auth-controller.js";

const AuthRouter = express.Router();

AuthRouter.route("/login").post(login);
AuthRouter.route("/reset-password").post(resetPassword);
AuthRouter.route("/forgot-password").post(forgotPassword);

export default AuthRouter;
