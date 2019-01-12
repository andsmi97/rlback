const mongoose = require('mongoose');

const projects = new mongoose.Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
  image1: String,
  image2: String,
});
module.exports = mongoose.model('Projects', projects);
