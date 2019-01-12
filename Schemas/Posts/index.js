const mongoose = require('mongoose');
let posts = new mongoose.Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
});
posts.add({ image: String });
module.exports = mongoose.model('Posts', posts);
