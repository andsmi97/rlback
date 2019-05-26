const mongoose = require('mongoose');

const tenant = new mongoose.Schema({
  houseNumber: { type: Number, unique: true },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Tenant', tenant);
