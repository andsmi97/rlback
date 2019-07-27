const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const user = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
  },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  phone2: String,
  hash: String,
  salt: String,
  email: String,
  MAIL: {
    USER: String,
    PASSWORD: String,
    SERVICE: String,
  },
  lastBillDate: Date,
  isInitialValuesSet: { type: Boolean, default: false },
});

user.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  this.password = password;
};

user.methods.validatePassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

user.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    'secret'
  );
};

user.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', user);
