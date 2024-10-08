import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./MongoDB/Connect.js";
import userRouter from "./Router/User.route.js";
import messageRouter from "./Router/Message.route.js";
import {
  addBlockContact,
  connectedUser,
  disconnectUser,
  readMessage,
  sendMessage,
} from "./Controller/Socket.user.controller.js";
import groupRouter from "./Router/Group.route.js";
import {
  disconnectGroupUser,
  leaveGroup,
  newUserJoinedGroup,
} from "./Controller/Socket.group.controller.js";
import { sendGroupMessage } from "./Controller/Socket.group.controller.js";

const app = express();

dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable cookies if necessary
  })
);

app.use(cookieParser());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(express.json());

app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/group", groupRouter);

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  //For Individual Chatting
  socket.on("connected-user", (data) => connectedUser(io, socket, data));
  socket.on("send-message", (data) => sendMessage(io, socket, data));
  socket.on("read-message", (data) => readMessage(io, socket, data));
  socket.on("disconnected-user", (data) => disconnectUser(io, socket, data));

  // For Groups
  socket.on("new-blocked-contact", (data) => addBlockContact(io, socket, data));
  socket.on("new-user-joined-group", (data) =>
    newUserJoinedGroup(io, socket, data)
  );
  socket.on("send-group-message", (data) => sendGroupMessage(io, socket, data));
  socket.on("leave-group", (data) => leaveGroup(io, socket, data));
  socket.on("disconnected-from-group", (data) =>
    disconnectGroupUser(io, socket, data)
  );
});

const port = process.env.PORT;

server.listen(port, async () => {
  await connectDB();
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
