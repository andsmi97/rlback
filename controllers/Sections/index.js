const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectionString = `mongodb://localhost:27017/TenantsDB`;
const formidable = require("formidable");
mongoose.connect(connectionString);

const db = mongoose.connection;
const SectionImages = require("../../Schemas/Sections");

db.on("error", console.error.bind(console, "connection error:"));

const addCarouselPhoto = (req, res) => {
  //Upload photo on server
  //Compress
  //Resize
  //AddPathToArray
  //Return status

  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../ozerodom.ru/img/carousel");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  form.multiples = true;
  form.parse(req, (err, fields, files) => {
    let { site } = fields;
    if (err) {
      response.json({
        result: "failed",
        data: {},
        message: `Cannot upload images. Error is : ${err}`
      });
    }
    let arrayOfFiles = [];
    for (let file in files) {
      arrayOfFiles.push(files[file]);
    }
    arrayOfFiles.forEach(file => {
      console.log(file.path);
      let regex = /^(.*?ozerodom.ru)/g;
      console.log(file.path.replace(regex, ""));
      SectionImages.findOneAndUpdate(
        { site },
        { $push: { carousel: file.path.replace(regex, "") } }
      )
        .then(() => res.status(200).json("Фотография добавлена"))
        .catch(err => res.status(400).json(err));
    });
  });
};

const addSiteSections = (req, res) => {
  const { site } = req.body;
  let sectionImages = new SectionImages({
    site
  });
  sectionImages.save(err => {
    if (err) res.status(400).json(err);
    res.status(200).json(sectionImages);
  });
};

const sectionPhotos = (req, res) => {
  let { site } = req.body;
  SectionImages.find({ site }, { _id: 0, carousel: 1 }).then(images => {
    res.status(200).json(images);
  });
};

module.exports = {
  addCarouselPhoto,
  addSiteSections,
  sectionPhotos
};
