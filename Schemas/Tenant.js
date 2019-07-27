const mongoose = require('mongoose');

const tenant = new mongoose.Schema({
  houseNumber: { type: Number, unique: true },
  email: { type: String },
  name: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TenantDocument' }],
  postIndex: { type: String },
  address: { type: String },
  contract: { type: String },
  initialDayValue: { type: Number },
  initialNightValue: { type: Number },
  lastDayValue: { type: Number },
  lastNightValue: { type: Number },
});
module.exports = mongoose.model('Tenant', tenant);
