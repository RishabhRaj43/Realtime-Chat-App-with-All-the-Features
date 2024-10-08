import bcrypt from "bcryptjs";
import User from "../Model/User.model.js";
import jsonSetToken from "../utils/jwtwebtoken.js";
import Message from "../Model/Message.model.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, displayName, phoneNumber, gender } =
      req.body;

    if (
      !username ||
      !email ||
      !password ||
      !displayName ||
      !phoneNumber ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (phoneNumber.length !== 10) {
      if (isNaN(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email)
        return res.status(400).json({ message: "Email already exists" });
      if (existingUser.username === username)
        return res.status(400).json({ message: "Username already exists" });
      if (existingUser.phoneNumber === phoneNumber)
        return res.status(400).json({ message: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      gender,
      password: hashedPassword,
      displayName,
      phoneNumber,
    });

    const token = jsonSetToken(user._id, res);
    return res
      .status(201)
      .json({ token, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jsonSetToken(user._id, res);

    return res
      .status(200)
      .json({ token, message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token_user");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, password, displayName, phoneNumber, gender } =
      req.body;

    console.log(req.body);

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username ? username : user.username;
    user.email = email ? email : user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
    user.displayName = displayName ? displayName : user.displayName;
    user.gender = gender ? gender : user.gender;
    await user.save();

    return res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getContact = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate({
      path: "contacts",
      match: { _id: { $ne: null } },
    });
    console.log("user: ", user.contacts);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ contact: user.contacts, blockedContact: user.blocked });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const saveContact = async (req, res) => {
  try {
    const userId = req.params.id;

    const { phoneNumber } = req.body;

    const contactUser = await User.findOne({ phoneNumber });
    if (!contactUser) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.contacts.includes(contactUser._id)) {
      return res.status(400).json({ message: "Contact already saved" });
    }

    user.contacts.push(contactUser._id);
    await user.save();

    return res.status(200).json({ message: "Contact saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.params.id;

    const sentMessages = await Message.find({
      senderId,
    }); // those people whom i have sent a message

    const receivedMessages = await Message.find({
      receiverId: senderId,
    }); // those people whom i have received a message

    const messageSet = new Set();
    sentMessages.forEach((message) => {
      messageSet.add(message.receiverId.toString());
    });

    receivedMessages.forEach((message) => {
      messageSet.add(message.senderId.toString());
    });

    console.log("messageSet: ", messageSet);

    const userContacts = await User.findById(senderId).populate("contacts");
    // console.log("userContacts: ", userContacts);

    userContacts.contacts.map((contact) => {
      if (messageSet.has(contact._id.toString())) {
        messageSet.delete(contact._id.toString());
      }
      // console.log("contact: ", contact._id);
    });

    // console.log("userContact: ", messageSet);

    const userPromises = Array.from(messageSet).map(
      async (id) => await User.findById(id)
    );
    const users = await Promise.all(userPromises);

    return res.status(200).json({ newUserArr: Array.from(messageSet), users });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const blockContact = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const user = await User.findById(senderId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.blocked.includes(receiverId)) {
      user.blocked.push(receiverId);
    } else {
      user.blocked = user.blocked.filter((id) => id !== receiverId);
    }
    await user.save();

    return res.status(200).json({
      message: !user.blocked.includes(receiverId)
        ? "unblocked successfully"
        : "blocked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
