import Message from "../Model/Message.model.js";
import User from "../Model/User.model.js";

let onlineUsers = [];
const socketUsers = new Map();

const undeliveredMessages = {}; // senderId : [receiverIds];
const blockedUsers = new Map();

export const connectedUser = async (io, socket, data) => {
  const { senderId } = data;

  if (!onlineUsers.includes(senderId)) {
    onlineUsers.push(senderId);
  }
  socketUsers.set(senderId, socket.id);

  if (!undeliveredMessages[senderId]) {
    undeliveredMessages[senderId] = new Set();
  }

  // console.log("onlineUsers: ", onlineUsers);

  io.emit("online-users", onlineUsers);

  const user = await User.findById(senderId);

  if (!user) {
    return io.to(socket.id).emit("error", "User not found");
  }
  user.isOnline = true;
  await user.save();

  const unSeenMessagesarr = await Message.find({
    receiverId: senderId,
    seen: false,
  });

  const unSeenMessagesSet = new Set();

  unSeenMessagesarr.forEach((user) => {
    unSeenMessagesSet.add(user.senderId);
  });

  const unSeenUserPromises = Array.from(unSeenMessagesSet).map(async (user) => {
    return await User.findById(user);
  });

  const unSeenMessagesArr = await Promise.all(unSeenUserPromises);
  // console.log("undeliveredMessagesArr: ", unSeenMessagesArr);

  io.to(socket.id).emit("unseen-message-arr", unSeenMessagesArr);
};

export const sendMessage = async (io, socket, data) => {
  try {
    const { senderId, receiverId, message } = data;
    if (!senderId || !receiverId || !message) {
      return io.to(socket.id).emit("error", "Invalid Data");
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (!undeliveredMessages[senderId]) {
      undeliveredMessages[senderId] = new Set();
    }

    undeliveredMessages[senderId].add(receiverId);

    await newMessage.save();

    if (socketUsers.get(receiverId)) {
      // console.log("receiverId SocketId: ", socketUsers.get(receiverId));
      const user = await User.findById(senderId);
      // console.log("user: ", user);

      io.to(socketUsers.get(receiverId)).emit("new-messages", { user, data });
      newMessage.delivered = true;
      await newMessage.save();
    }
  } catch (error) {
    console.log(error);
  }
};

export const readMessage = async (io, socket, data) => {
  const { senderId, receiverId } = data;
  await Message.updateMany(
    { senderId: receiverId, receiverId: senderId, delivered: false },
    { $set: { seen: true } }
  );

  if (undeliveredMessages[senderId]) {
    undeliveredMessages[senderId].delete(receiverId);
  }

  io.to(socket.id).emit("new-message", data);
};

export const addBlockContact = async (io, socket, data) => {
  const receiverId = data.receiverId;
  const senderId = data.senderId;
  const block = data.block;

  if (!blockedUsers.has(senderId)) {
    blockedUsers.set(senderId, new Set());
    console.log("New Set: ", blockedUsers.get(senderId));
  }

  if (block === true) {
    if (!blockedUsers.get(senderId).has(receiverId)) {
      blockedUsers.get(senderId).add(receiverId);
    }
  } else {
    if (blockedUsers.get(senderId).has(receiverId)) {
      blockedUsers.get(senderId).delete(receiverId);
    }
  }

  console.log("blockedUsers: ", blockedUsers);

  io.to(socket.id).emit(
    "add-blocked-contact",
    Array.from(blockedUsers.get(senderId))
  );
};
export const disconnectUser = async (io, socket, data) => {
  onlineUsers = onlineUsers.filter((user) => user !== data.senderId);

  if (socketUsers[data.senderId]) {
    socketUsers.delete(data.senderId);
  }

  const user = await User.findById(data.senderId);

  if (!user) {
    return io.to(socket.id).emit("error", "User not found");
  }
  user.isOnline = false;
  await user.save();

  io.emit("online-users", onlineUsers);
};
