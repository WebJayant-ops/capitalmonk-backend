import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connect.js";

// MiddleWares
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";
import { notFound } from "./middlewares/not-found.js";

// routes
import AuthRouter from "./routes/auth-routes.js";
import UserRouter from "./routes/user-routes.js";
import FundRouter from "./routes/fund-routes.js";
import TradeDetailRouter from "./routes/trade-detail-routes.js";
import TransactionRouter from "./routes/transaction-routes.js";
import InstructionRouter from "./routes/instruction-routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Trade Niche Backend</h1>");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/fund", FundRouter);
app.use("/api/v1/trade", TradeDetailRouter);
app.use("/api/v1/transaction", TransactionRouter);
app.use("/api/v1/instruction", InstructionRouter);

// middlewares
app.use(errorHandlerMiddleware);
app.use(notFound);

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    await connectDB(process.env.CONNECTION_URL);

    app.listen(port, () =>
      console.log(`Server is listening at port ${port}...`)
    );
  } catch (error) {
    console.log("error :>> ", error);
  }
};

start();

export default app;
