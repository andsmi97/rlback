const mongoose = require('mongoose');
const messageTemplate = new mongoose.Schema(
  {
    name: String,
    subject: String,
    message: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
module.exports = mongoose.model('MessageTemplate', messageTemplate);
