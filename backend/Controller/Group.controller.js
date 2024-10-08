import Group from "../Model/Group.model.js";
import User from "../Model/User.model.js";

export const getGroups = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    console.log("senderId: ", senderId);

    const user = await User.findById(senderId).populate("groups");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getGroupInfo = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const senderId = req.params.senderId;
    const group = await Group.findById(groupId).populate(
      "messages.senderId",
      "username displayName profilePicture phoneNumber"
    ); // it will find the user in User Model by messages.senderId and return the username displayName and profilePicture

    if (!group) {
      return res.status(404).json("Group not found");
    }

    return res.status(200).json(group);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const senderId = req.params.senderId;
    const group = await Group.findById(groupId).populate(
      "messages.senderId",
      "username displayName profilePicture phoneNumber"
    ); // it will find the user in User Model by messages.senderId and return the username displayName and profilePicture

    console.log("group: ", group);

    if (!group) {
      return res.status(404).json("No Messages yet");
    }

    return res.status(200).json({ messages: group.messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const createGroup = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const { groupHandle, groupName } = req.body;
    if (!groupName || !groupHandle) {
      return res.status(400).json("All fields are required");
    }

    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    const existingGroup = await Group.findOne({ groupHandle });
    if (existingGroup) {
      return res.status(400).json("Group already exists");
    }

    const newGroup = new Group({
      groupHandle,
      groupName,
      messages: [],
      members: [senderId],
    });

    await newGroup.save();
    user.groups.push(newGroup._id);
    await user.save();
    return res.status(200).json(newGroup);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const joinGroup = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const { groupHandle } = req.body;
    if (!groupHandle) {
      return res.status(400).json("All fields are required");
    }

    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    const group = await Group.findOne({ groupHandle });
    if (!group) {
      return res.status(404).json("Group not found");
    }

    if (group.members.includes(senderId)) {
      return res.status(400).json("You are already a member of this group");
    }

    group.members.push(senderId);
    await group.save();
    user.groups.push(group._id);
    await user.save();
    return res.status(200).json(group);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const senderId = req.params.senderId;

    const { groupHandle } = req.body;
    if (!groupHandle) {
      return res.status(400).json("All fields are required");
    }

    const user = await User.findById(senderId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const group = await Group.findOne({ groupHandle });
    if (!group) {
      return res.status(404).json("Group not found");
    }

    if (!group.members.includes(senderId)) {
      return res.status(400).json("You are not a member of this group");
    }

    group.members = group.members.filter(
      (id) => id.toString() !== senderId.toString()
    );
    console.log("group: ", group.members);

    await group.save();
    user.groups = user.groups.filter(
      (id) => id.toString() !== group._id.toString()
    );
    await user.save();
    return res.status(200).json(group);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json("Group not found");
    }

    const message = {
      senderId,
      message: req.body.message,
    };

    group.messages.push(message);
    await group.save();
    return res.status(200).json(group);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
