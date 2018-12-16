const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectionString = `mongodb://localhost:27017/TenantsDB`;
const formidable = require("formidable");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminJpegoptim = require("imagemin-jpegoptim");
const sharp = require("sharp");

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
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    let { site, section } = fields;
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
      let regex = /^(.*?ozerodom.ru)/g;
      imagemin([file.path], `./ozerodom.ru/img/${section}`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "65-80" }),
          imageminJpegoptim({ max: 50 })
        ]
      })
        .then(images =>
          images.forEach(image => {
            sharp(image.data)
              .resize(900)
              .toFile(image.path);
          })
        )
        .then(() => {
          let name = section;
          // let value = `${file.path.replace(regex, "")}`;
          let value = `/img${file.path.substring(file.path.lastIndexOf("/"))}`;
          let query = {};
          query[name] = value;
          SectionImages.findOneAndUpdate({ site }, { $push: query })
            .then(() => res.status(200).json("Фотография добавлена"))
            .then(() => {
              fs.unlink(file.path, err => {
                if (err) {
                  console.error(err.toString());
                }
              });
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => console.error(err));
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
  const { site, section } = req.body;
  let query = {};
  query[section] = 1;
  query._id = 0;
  SectionImages.find({ site }, query).then(images => {
    res.status(200).json(images);
  });
};

const deletePhoto = (req, res) => {
  const { site, section, photo } = req.body;
  let query = {};
  query[section] = photo;
  SectionImages.update({ site }, { $pull: query }).then(() => {
    res.status(200).json("фотография удалена");
  });
};

const updatePhoto = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      response.json({
        result: "failed",
        data: {},
        message: `Cannot upload images. Error is : ${err}`
      });
    }
    const { site, section, oldPhoto } = fields;
    let arrayOfFiles = [];
    for (let file in files) {
      arrayOfFiles.push(files[file]);
    }

    arrayOfFiles.forEach(file => {
      imagemin([file.path], `./${site}/img/${section}`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "65-80" }),
          imageminJpegoptim({ max: 50 })
        ]
      })
        .then(images =>
          images.forEach(image => {
            sharp(image.data)
              .resize(900)
              .toFile(image.path);
          })
        )
        .then(() => {
          let query = {};
          query._id = 0;
          query[section] = {
            $indexOfArray: [`$${section}`, oldPhoto]
          };
          SectionImages.aggregate([
            { $match: { site } },
            {
              $project: query
            }
          ]).then(result => {
            let query = {};
            query[
              `${section}.${result[0][section]}`
            ] = `/img${file.path.substring(file.path.lastIndexOf("/"))}`;
            SectionImages.update({ site }, { $set: query })
              .then(() => res.status(200).json("Фотография обновлена"))
              .then(() => {
                fs.unlink(file.path, err => {
                  if (err) {
                    console.error(err.toString());
                  }
                });
              })
              .catch(err => res.status(400).json(err));
          });
        })
        .catch(err => console.error(err));
    });
  });
};

const test = (req, res) => {
  const { site, oldPhoto, section, newPhoto } = req.body;
  let query = {};
  query._id = 0;
  query[section] = {
    $indexOfArray: [`$${section}`, oldPhoto]
  };
  SectionImages.aggregate([
    { $match: { site } },
    {
      $project: query
    }
  ]).then(result => {
    let obj = {};
    obj[`${section}.${result[0][section]}`] = newPhoto;
    SectionImages.update({ site }, { $set: obj }).then(data =>
      res.status(200).json(data)
    );
  });
};

module.exports = {
  addCarouselPhoto,
  addSiteSections,
  sectionPhotos,
  deletePhoto,
  updatePhoto,
  test
};
