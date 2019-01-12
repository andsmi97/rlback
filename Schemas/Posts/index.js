const mongoose = require('mongoose');

const posts = new mongoose.Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
});
posts.add({ image: String });
module.exports = mongoose.model('Posts', posts);
