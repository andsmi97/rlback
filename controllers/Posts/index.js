const mongoose = require('mongoose');
const formidable = require('formidable');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const validator = require('validator');

const Post = require('../../Schemas/Posts');

const connectionString = 'mongodb://localhost:27017/TenantsDB';

mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const insert = (req, res) => {
  console.log(req.body.data);
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  // parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const { site, title, body } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    // compress
    if (file) {
      return (
        imagemin([file.path], `./${site}/img/news`, {
          plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })],
        })
          // resize
          .then(images => sharp(images[0].data)
            .resize(900)
            .toFile(images[0].path))
          .then(() => {
            const newPost = new Post({
              title,
              body,
              date: Date.now(),
              image: `/img/news${file.path.substring(
                file.path.lastIndexOf('/') !== -1
                  ? file.path.lastIndexOf('/')
                  : file.path.lastIndexOf('\\')
              )}`,
            });
            newPost
              .save()
              .then(() => {
                fs.unlink(file.path, (err) => {
                  if (err) console.error(err.toString());
                });
              })
              .then(() => res.status(200).json(newPost))
              .catch((err) => {
                res.status(400).json(err);
              });
          })
          .catch(err => console.error(err))
      );
    }
    const newPost = new Post({
      title,
      body,
      date: Date.now(),
    });
    return newPost
      .save()
      .then(() => res.status(200).json(newPost))
      .catch((err) => {
        res.status(400).json(err);
      });
  });
};

const select = (req, res) => {
  const { date } = req.body;
  Post.find({ date: { $lt: date } }, null, { limit: 50 })
    .sort({ date: 'desc' })
    .then((posts) => {
      res.status(200).json(posts);
    });
};

const remove = (req, res) => {
  Post.findByIdAndDelete(req.body.id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(400).json(err));
};

const updatePhoto = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  // parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const { site, image, id } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    // compress
    return (
      imagemin([file.path], `./${site}/img/news`, {
        plugins: [imageminJpegtran(), imageminPngquant({ quality: '75-85' })],
      })
        // resize
        .then(images => sharp(images[0].data)
          .resize(900)
          .toFile(images[0].path))
        .then(() => {
          Post.findByIdAndUpdate(
            id,
            {
              $set: {
                image: `/img/news${file.path.substring(
                  file.path.lastIndexOf('/') !== -1
                    ? file.path.lastIndexOf('/')
                    : file.path.lastIndexOf('\\')
                )}`,
              },
            },
            (err) => {
              Post.findById(id)
                .then(post => res.status(200).json(post))
                .catch(err => res.status(400).json(err));
              if (err) res.status(400).json(err);
            }
          );
        })
        .then(() => {
          if (image.length) {
            fs.unlink(
              `${__dirname}/../../img/news${image.substring(
                image.lastIndexOf('/')
              )}`,
              (err) => {
                if (err) console.error(err.toString());
              }
            );
          }
        })
        .catch(err => console.error(err))
    );
  });
};

const deletePhoto = (req, res) => {
  const { id, image } = req.body;
  Post.findByIdAndUpdate(id, { $set: { image: '' } }, (err, dbRes) => {
    Post.findById(id)
      .then(post => res.status(200).json(post))
      .catch(err => res.status(400).json(err));
    if (err) res.status(400).json(err);
  });
  fs.unlink(
    `${__dirname}/../../img/news${image.substring(image.lastIndexOf('/'))}`,
    (err) => {
      if (err) console.error(err.toString());
    }
  );
};
const update = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  // parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const {
      site, image, id, title, body
    } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    // compress
    return (
      imagemin([file.path], `./${site}/img/news`, {
        plugins: [imageminJpegtran(), imageminPngquant({ quality: '75-85' })],
      })
        // resize
        .then(images => sharp(images[0].data)
          .resize(900)
          .toFile(images[0].path))
        .then(() => {
          Post.findByIdAndUpdate(
            id,
            {
              $set: {
                image: `/img/news${file.path.substring(
                  file.path.lastIndexOf('/') !== -1
                    ? file.path.lastIndexOf('/')
                    : file.path.lastIndexOf('\\')
                )}`,
                title,
                body,
              },
            },
            (err) => {
              Post.findById(id)
                .then(post => res.status(200).json(post))
                .catch(err => res.status(400).json(err));
              if (err) res.status(400).json(err);
            }
          );
        })
        .then(() => {
          if (image.length) {
            fs.unlink(
              `${__dirname}/../../img/news${image.substring(
                image.lastIndexOf('/')
              )}`,
              (err) => {
                if (err) console.error(err.toString());
              }
            );
          }
        })
        .catch(err => console.error(err))
    );
  });
};

console.log(validator.isNumeric('87'));
module.exports = {
  insert,
  select,
  remove,
  update,
  updatePhoto,
  deletePhoto,
};
