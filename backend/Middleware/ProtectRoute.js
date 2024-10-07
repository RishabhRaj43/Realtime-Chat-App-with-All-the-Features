import jwt from "jsonwebtoken";
import User from "../Model/User.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token_user;

    if (!token) {
      return res.status(401).json({ message: "No Token Found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await User.findById(decoded.userid);

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default protectRoute;