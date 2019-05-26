const mongoose = require('mongoose');
const article = new mongoose.Schema(
  {
    body: String,
    type: { type: String, enum: ['Post', 'Project'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Article', article);
