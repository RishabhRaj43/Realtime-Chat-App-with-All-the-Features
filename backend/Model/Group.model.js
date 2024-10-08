import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    AdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    }, //Keeping it for later
    groupHandle: {
      type: String,
      required: true,
      unique: true,
      match: /^@[\w\d_]+$/,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
