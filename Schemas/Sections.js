const mongoose = require('mongoose');

const content = new mongoose.Schema({
  site: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
  },
  carousel: [String],
  advertising: [String],
  genPlan: [String],
  gallery: [String],
  path: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Content', content);
