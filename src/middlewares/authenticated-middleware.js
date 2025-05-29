import jwt from "jsonwebtoken";

const authenticateMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "divubhai");
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized: Token has expired" });
    }
    res
      .status(401)
      .json({ success: false, msg: "Unauthorized: Invalid token" });
  }
};

export default authenticateMiddleware;
