const mongoose = require('mongoose');

const tariff = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    day: { type: Number },
    night: { type: Number },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Tariff', tariff);
