import mongoose from "mongoose";

export const connectDB = (url) => {
  return mongoose.connect(url, {
    // useNewUrlParser: false,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  });
};
