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


