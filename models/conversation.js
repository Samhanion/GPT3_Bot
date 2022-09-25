const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  client: {
    type: String,
    required: true,
    unique: true,
  },
  clientMessages: [
    {
      message: {
        type: String,
        // required: true,
      },
      inResponseTo: {
        type: String,
        // required: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  botMessages: [
    {
      message: {
        type: String,
        // required: true,
      },
      inResponseTo: {
        type: String,
        // required: true,
      },
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Conversation', conversationSchema);
