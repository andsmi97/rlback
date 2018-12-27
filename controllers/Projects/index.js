const mongoose = require("mongoose");
const formidable = require("formidable");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
// const imageminJpegoptim = require("imagemin-jpegoptim");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const Project = require("../../Schemas/Projects");
const connectionString = `mongodb://localhost:27017/TenantsDB`;
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const addProject = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  //parse
  form.parse(req, (err, fields, files) => {
    const { file1, file2 } = files;
    const { site, title, body } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    //compress
    if (file1 && file2) {
      imagemin([file1.path, file2.path], `./${site}/img/Projects`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "65-80" })
          // imageminJpegoptim({ max: 50 })
        ]
      })
        //resize
        .then(images =>
          images.forEach(image =>
            sharp(image.data)
              .resize(900)
              .toFile(image.path)
          )
        )
        .then(() => {
          let newProject = new Project({
            title: title,
            body: body,
            date: Date.now(),
            image1: `/img/Projects${file1.path.substring(
              file1.path.lastIndexOf("/")
            )}`,
            image2: `/img/Projects${file2.path.substring(
              file2.path.lastIndexOf("/")
            )}`
          });
          newProject
            .save()
            .then(() => {
              fs.unlink(file1.path, err => {
                if (err) console.error(err.toString());
              });
              fs.unlink(file2.path, err => {
                if (err) console.error(err.toString());
              });
            })
            .then(() => res.status(200).json(newProject))
            .catch(err => {
              res.status(400).json(err);
            });
        })
        .catch(err => console.error(err));
    } else if (file1) {
      imagemin([file1.path], `./${site}/img/Projects`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "65-80" })
          // imageminJpegoptim({ max: 50 })
        ]
      })
        //resize
        .then(images =>
          images.forEach(image =>
            sharp(image.data)
              .resize(900)
              .toFile(image.path)
          )
        )
        .then(() => {
          let newProject = new Project({
            title: title,
            body: body,
            date: Date.now(),
            image1: `/img/Projects${file1.path.substring(
              file1.path.lastIndexOf("/")
            )}`
          });
          newProject
            .save()
            .then(() => {
              fs.unlink(file1.path, err => {
                if (err) console.error(err.toString());
              });
            })
            .then(() => res.status(200).json(newProject))
            .catch(err => {
              res.status(400).json(err);
            });
        })
        .catch(err => console.error(err));
    } else if (file2) {
      imagemin([file2.path], `./${site}/img/Projects`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "65-80" })
          // imageminJpegoptim({ max: 50 })
        ]
      })
        //resize
        .then(images =>
          images.forEach(image =>
            sharp(image.data)
              .resize(900)
              .toFile(image.path)
          )
        )
        .then(() => {
          let newProject = new Project({
            title: title,
            body: body,
            date: Date.now(),
            image2: `/img/Projects${file2.path.substring(
              file2.path.lastIndexOf("/")
            )}`
          });
          newProject
            .save()
            .then(() => {
              fs.unlink(file2.path, err => {
                if (err) console.error(err.toString());
              });
            })
            .then(() => res.status(200).json(newProject))
            .catch(err => {
              res.status(400).json(err);
            });
        })
        .catch(err => console.error(err));
    } else {
      let newProject = new Project({
        title: title,
        body: body,
        date: Date.now()
      });
      newProject
        .save()
        .then(() => res.status(200).json(newProject))
        .catch(err => {
          res.status(400).json(err);
        });
    }
  });
};

const getProjects = (req, res) => {
  let { date } = req.body;
  Project.find({ date: { $lt: date } }, null, { limit: 50 })
    .sort({ date: "desc" })
    .then(projects => {
      res.status(200).json(projects);
    });
};

const deleteProject = (req, res) => {
  Project.findByIdAndDelete(req.body.id)
    .then(project => res.status(200).json(project))
    .catch(err => res.status(400).json(err));
};

const updateProjectPhoto = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  //parse
  form.parse(req, (err, fields, files) => {
    const { file, file1 } = files;
    const { site, image, id } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    imagemin([file.path, file1.path], `./${site}/img/projects`, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality: "75-85" })
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
        Project.findByIdAndUpdate(
          id,
          {
            $set: {
              image1: `/img/Projects${file.path.substring(
                file.path.lastIndexOf("/")
              )}`,
              image2: `/img/Projects${file1.path.substring(
                file1.path.lastIndexOf("/")
              )}`
            }
          },
          (err, dbRes) => {
            Project.findById(id)
              .then(project => res.status(200).json(project))
              .catch(err => res.status(400).json(err));
            if (err) res.status(400).json(err);
          }
        );
      })
      .then(() => {
        if (image.length) {
          fs.unlink(
            `${__dirname}/../../img/Projects${image.substring(
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

const deleteProjectPhoto = (req, res) => {
  const { id, image } = req.body;
  Project.findByIdAndUpdate(id, { $set: { image: `` } }, (err, dbRes) => {
    Project.findById(id)
      .then(project => res.status(200).json(project))
      .catch(err => res.status(400).json(err));
    if (err) res.status(400).json(err);
  });
  fs.unlink(
    `${__dirname}/../../img/Projects${image.substring(image.lastIndexOf("/"))}`,
    err => {
      if (err) console.error(err.toString());
    }
  );
};
const updateProject = (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../Uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //50 MB
  //parse
  form.parse(req, (err, fields, files) => {
    const { file1, file2 } = files;
    console.log(file1, file2);
    const { site, image1, id, title, body, image2 } = fields;
    console.log(site, image1, id, title, body, image2);
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    //compress
    if (file1 && file2) {
      console.log("bothfiles");
      imagemin([file1.path, file2.path], `./${site}/img/Projects`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "75-85" })
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
          Project.findByIdAndUpdate(
            id,
            {
              $set: {
                image1: `/img/Projects${file1.path.substring(
                  file1.path.lastIndexOf("/")
                )}`,
                image2: `/img/Projects${file2.path.substring(
                  file2.path.lastIndexOf("/")
                )}`,
                title,
                body
              }
            },
            (err, dbRes) => {
              Project.findById(id)
                .then(project => res.status(200).json(project))
                .catch(err => res.status(400).json(err));
              if (err) res.status(400).json(err);
            }
          );
        })
        .then(() => {
          if (image1.length) {
            fs.unlink(
              `${__dirname}/../../img/Projects${image1.substring(
                image1.lastIndexOf("/")
              )}`,
              err => {
                if (err) console.error(err.toString());
              }
            );
          }
          if (image2.length) {
            fs.unlink(
              `${__dirname}/../../img/Projects${image2.substring(
                image2.lastIndexOf("/")
              )}`,

              err => {
                if (err) console.error(err.toString());
              }
            );
          }
        })
        .catch(err => console.error(err));
    } else if (file1) {
      console.log("file1");
      imagemin([file1.path], `./${site}/img/Projects`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "75-85" })
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
          Project.findByIdAndUpdate(
            id,
            {
              $set: {
                image1: `/img/Projects${file1.path.substring(
                  file1.path.lastIndexOf("/")
                )}`,
                title,
                body
              }
            },
            (err, dbRes) => {
              Project.findById(id)
                .then(project => res.status(200).json(project))
                .catch(err => res.status(400).json(err));
              if (err) res.status(400).json(err);
            }
          );
        })
        .then(() => {
          if (image1.length) {
            fs.unlink(
              `${__dirname}/../../img/Projects${image1.substring(
                image1.lastIndexOf("/")
              )}`,
              err => {
                if (err) console.error(err.toString());
              }
            );
          }
        })
        .catch(err => console.error(err));
    } else if (file2) {
      console.log("file2");
      imagemin([file2.path], `./${site}/img/Projects`, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: "75-85" })
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
          Project.findByIdAndUpdate(
            id,
            {
              $set: {
                image2: `/img/Projects${file2.path.substring(
                  file2.path.lastIndexOf("/")
                )}`,
                title,
                body
              }
            },
            (err, dbRes) => {
              Project.findById(id)
                .then(project => res.status(200).json(project))
                .catch(err => res.status(400).json(err));
              if (err) res.status(400).json(err);
            }
          );
        })
        .then(() => {
          if (image2.length) {
            fs.unlink(
              `${__dirname}/../../img/Projects${image2.substring(
                image2.lastIndexOf("/")
              )}`,
              err => {
                if (err) console.error(err.toString());
              }
            );
          }
        })
        .catch(err => console.error(err));
    } else {
      console.log("none");
      Project.findByIdAndUpdate(id, { $set: { title, body } }, (err, dbRes) => {
        Project.findById(id)
          .then(project => res.status(200).json(project))
          .catch(err => res.status(400).json(err));
        if (err) res.status(400).json(err);
      });
    }
  });
  // let { id, title, body } = req.body;

  // Project.findByIdAndUpdate(
  //   id,
  //   {
  //     $set: {
  //       title: title,
  //       body: body
  //     }
  //   },
  //   (err, dbRes) => {
  //     Project.findById(id)
  //       .then(project => res.status(200).json(project))
  //       .catch(err => res.status(400).json(err));
  //     if (err) res.status(400).json(err);
  //   }
  // );
};

module.exports = {
  addProject,
  getProjects,
  deleteProject,
  updateProject,
  updateProjectPhoto,
  deleteProjectPhoto
};
