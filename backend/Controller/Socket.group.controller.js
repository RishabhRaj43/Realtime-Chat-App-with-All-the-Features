import Group from "../Model/Group.model.js";
import User from "../Model/User.model.js";

const socketGroups = new Map();

export const newUserJoinedGroup = async (io, socket, data) => {
  const { groupId, senderId } = data;

  const group = await Group.findById(groupId);

  if (!group) {
    return;
  }

  if (!socketGroups.has(groupId)) {
    socketGroups.set(groupId, new Set());
  }

  if (!socketGroups.get(groupId).has(senderId)) {
    socketGroups.get(groupId).add(senderId);
  }

  socket.join(groupId);
  io.to(groupId).emit(
    "new-user-joined-group",
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
};

export const disconnectGroupUser = async (io, socket, data) => {
  const { groupId, senderId } = data;
  socketGroups.get(groupId).delete(senderId);
  socket.leave(groupId);
};
