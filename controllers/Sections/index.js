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
const SectionImages = require("../../Schemas/Sections");

mongoose.connect(connectionString);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const addPhoto = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  //parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const { site, section } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    let imageSize = 900;
    if (section=="carousel") imageSize=930;
    else if(section=="genPlan") imageSize=930;
    else if(section=="advertising") imageSize = 195; //425:195
    else if(section="gallery") imageSize = 930;
    else if(section="path") imageSize = 280;
    imagemin([file.path], `./${site}/img/${section}`, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality: "75-85" }),
        imageminJpegoptim({ max: 70 })
      ]
    })
      //resize
      .then(images =>
        sharp(images[0].data)
          .resize(imageSize)
          .toFile(images[0].path)
      )
      //save to DB
      .then(() => {
        let query = {};
        query[section] = `/img/${section}${file.path.substring(
          file.path.lastIndexOf("/")
        )}`;
        SectionImages.findOneAndUpdate({ site }, { $push: query })
          //remove from uploaded
          .then(() => {
            fs.unlink(file.path, err => {
              if (err) console.error(err.toString());
            });
          })
          .then(() => res.status(200).json("Фотография добавлена"))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => console.error(err));
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
    res.status(200).json(images[0][section]);
  });
};

const siteContent = (req, res) => {
  const { site } = req.body;
  SectionImages.find({ site }, { _id: 0, site: 0, __v: 0, projects: 0 }).then(
    images => {
      res.status(200).json(images[0]);
    }
  );
};
const deletePhoto = (req, res) => {
  const { site, section, photo } = req.body;
  let query = {};
  query[section] = photo;
  SectionImages.update({ site }, { $pull: query }).then(() => {
    res.status(200).json("фотография удалена");
  });
};

const reorderPhotos = (req, res) => {
  const { photos, section, site } = req.body;
  SectionImages.findOneAndUpdate(site, { $set: { [section]: photos } })
    .then(() => res.status(200).json("Данные обновлены"))
    .catch(err => res.status(400).json(err));
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
    let imageSize = 900;
    if (section=="carousel") imageSize=900;
    else if(section=="genPlan") imageSize=900;
    else if(section=="advertising") imageSize = 195; //425:195
    else if(section="gallery") imageSize = 930;
    else if(section="path") imageSize = 280;
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
              .resize(imageSize)
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
            ] = `/img/${section}${file.path.substring(
              file.path.lastIndexOf("/")
            )}`;
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

module.exports = {
  addPhoto,
  addSiteSections,
  sectionPhotos,
  deletePhoto,
  updatePhoto,
  siteContent,
  reorderPhotos
};
