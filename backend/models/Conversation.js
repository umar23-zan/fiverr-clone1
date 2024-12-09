const mongoose = require("mongoose");
// import messageSchema from './Message'
const messageSchema = require('./Message')

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Array of users
    ],
    messages: [messageSchema.schema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
