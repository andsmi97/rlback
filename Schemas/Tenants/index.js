const mongoose = require('mongoose');

const tenants = new mongoose.Schema({
  houseNumber: { type: Number, unique: true },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
});
module.exports = mongoose.model('Tenant', tenants);
