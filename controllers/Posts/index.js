const mongoose = require("mongoose");
const formidable = require("formidable");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
// const imageminJpegoptim = require("imagemin-jpegoptim");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const Post = require("../../Schemas/Posts");
const connectionString = `mongodb://localhost:27017/TenantsDB`;
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const addPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  //parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const { site, title, body } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    //compress
    imagemin([file.path], `./${site}/img/news`, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality: "65-80" }),
        // imageminJpegoptim({ max: 50 })
      ]
    })
      //resize
      .then(images =>
        sharp(images[0].data)
          .resize(900)
          .toFile(images[0].path)
      )
      .then(() => {
        let newPost = new Post({
          title: title,
          body: body,
          date: Date.now(),
          image: `/img/news${file.path.substring(file.path.lastIndexOf("/"))}`
        });
        newPost
          .save()
          .then(() => {
            fs.unlink(file.path, err => {
              if (err) console.error(err.toString());
            });
          })
          .then(() => res.status(200).json(newPost))
          .catch(err => {
            res.status(400).json(err);
          });
      })
      .catch(err => console.error(err));
  });
};

const getPosts = (req, res) => {
  let { date } = req.body;
  Post.find({ date: { $lt: date } }, null, { limit: 50 })
    .sort({ date: "desc" })
    .then(posts => {
      res.status(200).json(posts);
    });
};

const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.body.id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(400).json(err));
};

const updatePostPhoto = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  //parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const { site, image, id } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    //compress
    imagemin([file.path], `./${site}/img/news`, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality: "75-85" }),
        // imageminJpegoptim({ max: 70 })
      ]
    })
      //resize
      .then(images =>
        sharp(images[0].data)
          .resize(900)
          .toFile(images[0].path)
      )
      .then(() => {
        Post.findByIdAndUpdate(
          id,
          {
            $set: {
              image: `/img/news${file.path.substring(
                file.path.lastIndexOf("/")
              )}`
            }
          },
          (err, dbRes) => {
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
              image.lastIndexOf("/")
            )}`,
            err => {
              if (err) console.error(err.toString());
            }
          );
        }
      })
      .catch(err => console.error(err));
  });
};

const deletePostPhoto = (req, res) => {
  const { id, image } = req.body;
  Post.findByIdAndUpdate(id, { $set: { image: `` } }, (err, dbRes) => {
    Post.findById(id)
      .then(post => res.status(200).json(post))
      .catch(err => res.status(400).json(err));
    if (err) res.status(400).json(err);
  });
  fs.unlink(
    `${__dirname}/../../img/news${image.substring(image.lastIndexOf("/"))}`,
    err => {
      if (err) console.error(err.toString());
    }
  );
};
const updatePost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  //parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const { site, image, id, title, body } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    //compress
    imagemin([file.path], `./${site}/img/news`, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality: "75-85" }),
        // imageminJpegoptim({ max: 70 })
      ]
    })
      //resize
      .then(images =>
        sharp(images[0].data)
          .resize(900)
          .toFile(images[0].path)
      )
      .then(() => {
        Post.findByIdAndUpdate(
          id,
          {
            $set: {
              image: `/img/news${file.path.substring(
                file.path.lastIndexOf("/")
              )}`,
              title,
              body
            }
          },
          (err, dbRes) => {
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
              image.lastIndexOf("/")
            )}`,
            err => {
              if (err) console.error(err.toString());
            }
          );
        }
      })
      .catch(err => console.error(err));
  });
  // let { id, title, body } = req.body;
  
  // Post.findByIdAndUpdate(
  //   id,
  //   {
  //     $set: {
  //       title: title,
  //       body: body
  //     }
  //   },
  //   (err, dbRes) => {
  //     Post.findById(id)
  //       .then(post => res.status(200).json(post))
  //       .catch(err => res.status(400).json(err));
  //     if (err) res.status(400).json(err);
  //   }
  // );
};

module.exports = {
  addPost,
  getPosts,
  deletePost,
  updatePost,
  updatePostPhoto,
  deletePostPhoto
};
