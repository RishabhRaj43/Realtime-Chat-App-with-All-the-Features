import express from "express";
import Message from "../Model/Message.model.js";
import { getGroupMessages, getMessages } from "../Controller/Message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/:senderId/getmessages/:receiverId", getMessages);

messageRouter.get("/:senderId/getgroupmessages/:groupId", getGroupMessages);

export default messageRouter;
