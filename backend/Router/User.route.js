import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  getUser,
  saveContact,
  getContact,
  getMessages,
  blockContact
} from "../Controller/User.controller.js";
import protectRoute from "../Middleware/ProtectRoute.js";

const userRouter = express.Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/:id", protectRoute, getUser);
userRouter.put("/:id/update", protectRoute, updateUser);

userRouter.get("/:id/getContact", protectRoute, getContact);
userRouter.post("/:id/saveContact", protectRoute, saveContact);

userRouter.get("/:id/getmessages", protectRoute, getMessages);

userRouter.put("/:senderId/blocked/:receiverId", protectRoute, blockContact);

export default userRouter;
