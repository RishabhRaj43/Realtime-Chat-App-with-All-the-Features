import Chat from "../Model/Chat.model.js";
import Message from "../Model/Message.model.js";

export const getMessages = async (req, res) => {
  try {
    const { senderId } = req.params;
    const { receiverId } = req.params;

    const message = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const message = await Chat.findById(chatId).populate(
      "messages.senderId",
      "username displayName profilePicture"
    ); // it will find the user in User Model by messages.senderId and return the username displayName and profilePicture

    if (!chat) {
      return res.status(404).json("Chat not found");
    }

    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
