import express from "express";
import {
  createGroup,
  getGroupInfo,
  getGroupMessages,
  getGroups,
  joinGroup,
  leaveGroup,
  sendGroupMessage,
} from "../Controller/Group.controller.js";

const groupRouter = express.Router();

groupRouter.get("/:senderId/getGroups", getGroups);
groupRouter.get("/:senderId/getGroupInfo/:groupId", getGroupInfo);
groupRouter.get("/:senderId/getGroupMessages/:groupId", getGroupMessages);
groupRouter.post("/:senderId/createGroup", createGroup);

groupRouter.post("/:senderId/joinGroup", joinGroup);
groupRouter.post("/:senderId/leaveGroup", leaveGroup);

groupRouter.post("/:senderId/sendGroupMessage/:groupId",sendGroupMessage )

export default groupRouter;
