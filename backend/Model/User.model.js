import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  gender:{
    type: String,
    enum: ["Male", "Female", "Prefer not to say"],
    required: true,
  },
  displayName: {
    type: String,
    trim: true,
    default: "User",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "Hey there! I am using WhatsApp.",
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
