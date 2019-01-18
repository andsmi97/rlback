const mongoose = require('mongoose');
const formidable = require('formidable');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const Project = require('../../Schemas/Projects');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const insert = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  // parse
  form.parse(req, (err, fields, files) => {
    const { file1, file2 } = files;
    const { site, title, body } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    // compress
    if (file1 && file2) {
      return (
        imagemin([file1.path, file2.path], `./${site}/img/Projects`, {
          plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })],
        })
          // resize
          .then(images => images.forEach(image => sharp(image.data)
            .resize(900)
            .toFile(image.path)))
          .then(() => {
            const newProject = new Project({
              title,
              body,
              date: Date.now(),
              image1: `/img/Projects${file1.path.substring(
                file1.path.lastIndexOf('/')
              )}`,
              image2: `/img/Projects${file2.path.substring(
                file2.path.lastIndexOf('/')
              )}`,
            });
            newProject
              .save()
              .then(() => {
                fs.unlink(file1.path, (err) => {
                  if (err) console.error(err.toString());
                });
                fs.unlink(file2.path, (err) => {
                  if (err) console.error(err.toString());
                });
              })
              .then(() => res.status(200).json(newProject))
              .catch((err) => {
                res.status(400).json(err);
              });
          })
          .catch(err => console.error(err))
      );
    }
    if (file1) {
      return (
        imagemin([file1.path], `./${site}/img/Projects`, {
          plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })],
        })
          // resize
          .then(images => images.forEach(image => sharp(image.data)
            .resize(900)
            .toFile(image.path)))
          .then(() => {
            const newProject = new Project({
              title,
              body,
              date: Date.now(),
              image1: `/img/Projects${file1.path.substring(
                file1.path.lastIndexOf('/')
              )}`,
            });
            newProject
              .save()
              .then(() => {
                fs.unlink(file1.path, (err) => {
                  if (err) console.error(err.toString());
                });
              })
              .then(() => res.status(200).json(newProject))
              .catch((err) => {
                res.status(400).json(err);
              });
          })
          .catch(err => console.error(err))
      );
    }
    if (file2) {
      return (
        imagemin([file2.path], `./${site}/img/Projects`, {
          plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })],
        })
          // resize
          .then(images => images.forEach(image => sharp(image.data)
            .resize(900)
            .toFile(image.path)))
          .then(() => {
            const newProject = new Project({
              title,
              body,
              date: Date.now(),
              image2: `/img/Projects${file2.path.substring(
                file2.path.lastIndexOf('/')
              )}`,
            });
            newProject
              .save()
              .then(() => {
                fs.unlink(file2.path, (err) => {
                  if (err) console.error(err.toString());
                });
              })
              .then(() => res.status(200).json(newProject))
              .catch((err) => {
                res.status(400).json(err);
              });
          })
          .catch(err => console.error(err))
      );
    }
    const newProject = new Project({
      title,
      body,
      date: Date.now(),
    });
    return newProject
      .save()
      .then(() => res.status(200).json(newProject))
      .catch((err) => {
        res.status(400).json(err);
      });
  });
};

const select = (req, res) => {
  const { date } = req.body;
  Project.find({ date: { $lt: date } }, null, { limit: 50 })
    .sort({ date: 'desc' })
    .then((projects) => {
      res.status(200).json(projects);
    });
};

const remove = (req, res) => {
  Project.findByIdAndDelete(req.body.id)
    .then(project => res.status(200).json(project))
    .catch(err => res.status(400).json(err));
};

const updatePhoto = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  // parse
  form.parse(req, (err, fields, files) => {
    const { file, file1 } = files;
    const { site, image, id } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    return (
      imagemin([file.path, file1.path], `./${site}/img/projects`, {
        plugins: [imageminJpegtran(), imageminPngquant({ quality: '75-85' })],
      })
        // resize
        .then(images => sharp(images[0].data)
          .resize(900)
          .toFile(images[0].path))
        .then(() => {
          Project.findByIdAndUpdate(
            id,
            {
              $set: {
                image1: `/img/Projects${file.path.substring(
                  file.path.lastIndexOf('/') !== -1
                    ? file.path.lastIndexOf('/')
                    : file.path.lastIndexOf('\\')
                )}`,
                image2: `/img/Projects${file1.path.substring(
                  file1.path.lastIndexOf('/')
                )}`,
              },
            },
            (err) => {
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

const removePhoto = (req, res) => {
  const { id, image } = req.body;
  Project.findByIdAndUpdate(id, { $set: { image: '' } }, (err, dbRes) => {
    Project.findById(id)
      .then(project => res.status(200).json(project))
      .catch(err => res.status(400).json(err));
    if (err) res.status(400).json(err);
  });
  fs.unlink(
    `${__dirname}/../../img/Projects${image.substring(image.lastIndexOf('/'))}`,
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
    const { file1, file2 } = files;
    const {
      site, image1, id, title, body, image2
    } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    // compress
    if (file1 && file2) {
      return (
        imagemin([file1.path, file2.path], `./${site}/img/Projects`, {
          plugins: [imageminJpegtran(), imageminPngquant({ quality: '75-85' })],
        })
          // resize
          .then(images => sharp(images[0].data)
            .resize(900)
            .toFile(images[0].path))
          .then(() => {
            Project.findByIdAndUpdate(
              id,
              {
                $set: {
                  image1: `/img/Projects${file1.path.substring(
                    file1.path.lastIndexOf('/')
                  )}`,
                  image2: `/img/Projects${file2.path.substring(
                    file2.path.lastIndexOf('/')
                  )}`,
                  title,
                  body,
                },
              },
              (err) => {
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
                  image1.lastIndexOf('/')
                )}`,
                (err) => {
                  if (err) console.error(err.toString());
                }
              );
            }
            if (image2.length) {
              fs.unlink(
                `${__dirname}/../../img/Projects${image2.substring(
                  image2.lastIndexOf('/')
                )}`,

                (err) => {
                  if (err) console.error(err.toString());
                }
              );
            }
          })
          .catch(err => console.error(err))
      );
    }
    if (file1) {
      return (
        imagemin([file1.path], `./${site}/img/Projects`, {
          plugins: [imageminJpegtran(), imageminPngquant({ quality: '75-85' })],
        })
          // resize
          .then(images => sharp(images[0].data)
            .resize(900)
            .toFile(images[0].path))
          .then(() => {
            Project.findByIdAndUpdate(
              id,
              {
                $set: {
                  image1: `/img/Projects${file1.path.substring(
                    file1.path.lastIndexOf('/')
                  )}`,
                  title,
                  body,
                },
              },
              (err) => {
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
                  image1.lastIndexOf('/')
                )}`,
                (err) => {
                  if (err) console.error(err.toString());
                }
              );
            }
          })
          .catch(err => console.error(err))
      );
    }
    if (file2) {
      return (
        imagemin([file2.path], `./${site}/img/Projects`, {
          plugins: [imageminJpegtran(), imageminPngquant({ quality: '75-85' })],
        })
          // resize
          .then(images => sharp(images[0].data)
            .resize(900)
            .toFile(images[0].path))
          .then(() => {
            Project.findByIdAndUpdate(
              id,
              {
                $set: {
                  image2: `/img/Projects${file2.path.substring(
                    file2.path.lastIndexOf('/')
                  )}`,
                  title,
                  body,
                },
              },
              (err) => {
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
                  image2.lastIndexOf('/')
                )}`,
                (err) => {
                  if (err) console.error(err.toString());
                }
              );
            }
          })
          .catch(err => console.error(err))
      );
    }
    return Project.findByIdAndUpdate(id, { $set: { title, body } }, (err) => {
      Project.findById(id)
        .then(project => res.status(200).json(project))
        .catch(err => res.status(400).json(err));
      if (err) res.status(400).json(err);
    });
  });
};

module.exports = {
  insert,
  select,
  remove,
  update,
  updatePhoto,
  removePhoto,
};
