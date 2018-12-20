const mongoose = require("mongoose");
let progects = new mongoose.Schema({
    title: String,
    body: String,
    date: { type: Date, default: Date.now },
    image: String,
    image2: String
});
module.exports = mongoose.model("Progects", progects);