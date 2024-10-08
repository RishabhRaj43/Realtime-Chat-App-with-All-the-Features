import Group from "../Model/Group.model.js";
import User from "../Model/User.model.js";

const socketGroups = new Map();
const socketUsers = new Map();

export const newUserJoinedGroup = async (io, socket, data) => {
  const { groupId, senderId } = data;

  const group = await Group.findById(groupId);

  if (!group) {
    return;
  }

  if (!socketGroups.has(groupId)) {
    socketGroups.set(groupId, new Set());
  }

  socketGroups.get(groupId).add(senderId);

  if (!socketUsers.has(senderId)) {
    socketUsers.set(senderId, new Set());
  }

  socketUsers.get(senderId).add(groupId);

  socket.join(groupId);
  io.to(groupId).emit(
    "total-user-joined-group",
    Array.from(socketGroups.get(groupId))
  );
};

export const sendGroupMessage = async (io, socket, data) => {
  const { senderId, groupId, message } = data;

  const user = await User.findById(senderId);

  io.to(groupId).emit("new-group-message", {
    user,
    groupId,
    message,
  });
};

export const leaveGroup = async (io, socket, data) => {
  const { groupId, senderId } = data;
  socketGroups.get(groupId).delete(senderId);
  socket.leave(groupId);

  if (socketGroups.get(groupId).size === 0) {
    socketGroups.delete(groupId);
  }

  socketUsers.get(senderId).delete(groupId);

  const user = await User.findById(senderId);

  io.to(groupId).emit("someone-left-group", user);
  io.to(groupId).emit(
    "total-user-joined-group",
    Array.from(socketGroups.get(groupId))
  );
};

export const disconnectGroupUser = async (io, socket, data) => {
  const { senderId } = data;

  const userGroups = Array.from(socketUsers.get(senderId));

  userGroups.forEach((groupId) => {
    socketGroups.get(groupId).delete(senderId);
    io.to(groupId).emit(
      "total-user-joined-group",
      Array.from(socketGroups.get(groupId))
    );
    socket.leave(groupId);
  });
  socketUsers.delete(senderId);
};
