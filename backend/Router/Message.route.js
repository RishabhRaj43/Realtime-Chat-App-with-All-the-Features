import express from "express";
import { getMessages } from "../Controller/Message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/:senderId/getmessages/:receiverId", getMessages);

export default messageRouter;
