const mongoose = require('mongoose');
const sectionImages = new mongoose.Schema({
  site: { type: String, unique: true, required: true, dropDups: true },
  carousel: [String],
  advertising: [String],
  genPlan: [String],
  infrastructures: [String],
  gallery: [String],
  path: [String],
  projects: [String],
});
module.exports = mongoose.model('sectionImages', sectionImages);
