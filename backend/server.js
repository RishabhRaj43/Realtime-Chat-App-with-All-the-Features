import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./MongoDB/Connect.js";
import userRouter from "./Router/User.route.js";
import messageRouter from "./Router/Message.route.js";
import { addBlockContact, connectedUser, disconnectUser, readMessage, sendMessage } from "./Controller/Socket.controller.js";

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

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  
  socket.on("hello",(data)=>{
    console.log("data: ", data);
    
    io.to(socket.id).emit("new-connected-user", socket.id);
  })

  socket.on("connected-user", (data) => connectedUser(io, socket, data));
  socket.on("send-message", (data) => sendMessage(io, socket, data));
  socket.on("read-message" ,(data) => readMessage(io, socket, data));
  socket.on("disconnected-user", (data) => disconnectUser(io, socket,data));
  socket.on("new-blocked-contact", (data) => addBlockContact(io, socket, data));
});

const port = process.env.PORT;

server.listen(port, async () => {
  await connectDB();
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
