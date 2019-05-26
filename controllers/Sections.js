const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const formidable = require('formidable');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
const SectionImages = require('../Schemas/Sections');

mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const addPhoto = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  // parse
  form.parse(req, (err, fields, files) => {
    const { file } = files;
    const { site, section } = fields;
    if (err) return res.status(400).json(`Возникла ошибка: ${err}`);
    let imageSize = 900;
    if (section === 'carousel') imageSize = 930;
    else if (section === 'genPlan') imageSize = 930;
    else if (section === 'advertising') imageSize = 430;
    else if (section === 'gallery') imageSize = 930;
    else if (section === 'path') imageSize = 280;
    return (
      imagemin([file.path], `./${site}/img/${section}`, {
        plugins: [imageminJpegtran(), imageminPngquant({ quality: '75-85' })],
      })
        // resize
        .then(images =>
          sharp(images[0].data)
            .resize(imageSize)
            .toFile(images[0].path)
        )
        // save to DB
        .then(() => {
          const query = {};
          query[section] = `/img/${section}${file.path.substring()}`;
          SectionImages.findOneAndUpdate({ site }, { $push: query })
            .then(() =>
              res.status(200).json({
                section,
                content: `/img/${section}${file.path.substring(
                  file.path.lastIndexOf('/')
                )}`,
              })
            )
            .then(() => {
              fs.unlink(file.path, err => {
                if (err) console.error(err.toString());
              });
            })

            .catch(err => res.status(400).json(err));
        })
        .catch(err => console.error(err))
    );
  });
};

const clearAll = (req, res) => {
  const { site } = req.body;
  SectionImages.findOneAndUpdate(
    { site },
    {
      carousel: [],
      advertising: [],
      genPlan: [],
      infrastructures: [],
      gallery: [],
      path: [],
    }
  )
    .then(() => res.status(200).json('Фотографии удалены'))
    .catch(err => res.status(400).json(err));
};
const addDefaultPhotos = (req, res) => {
  const { site } = req.body;
  SectionImages.findOneAndUpdate(
    { site },
    {
      carousel: [
        '/img/carousel/upload_fb005863b2350e338bcb8b6c00ba9086.jpg',
        '/img/carousel/upload_9990a8483163608b1b60096fa9b49825.jpg',
        '/img/carousel/upload_4310b8dbd19ca7da0718b476d2ee3daf.jpg',
        '/img/carousel/upload_c9f08397461feb07d26db4273eec8916.jpg',
        '/img/carousel/upload_7c9e14a8110283b54656a57598dda86b.jpg',
        '/img/carousel/upload_e902be5e28caa6502c295a975a12f87a.jpg',
        '/img/carousel/upload_fa6fce75b11c99ba167d0f31eb5f8033.jpg',
        '/img/carousel/upload_7b8eab5bce7e8784d7403988dbd36f72.jpg',
      ],
      advertising: [
        '/img/advertising/upload_1cacee3559dd230caac045182e2ea0fb.jpg',
        '/img/advertising/upload_8db617adfa0f47253b49c7f37c647094.jpg',
      ],
      genPlan: [
        '/img/genPlan/upload_99db0a243ecd64a2d310b597e249be5e.png',
        '/img/genPlan/upload_223b7bb8af66a693c8adda76150c24e0.jpg',
      ],
      infrastructures: [],
      gallery: [
        '/img/gallery/upload_2835d4510cff96f3fd84bdeadd51b46e.jpg',
        '/img/gallery/upload_29f8e770484e5187288c6462998f00e6.jpg',
        '/img/gallery/upload_b42aac159f524274e1f14e5e2350e952.jpg',
        '/img/gallery/upload_73f730205a6af361df4a73d52c3f85fa.jpg',
        '/img/gallery/upload_c381cfa382457802fc8eaf80fd1dceed.jpg',
        '/img/gallery/upload_53ed71f827e354da2a8c5cebda806780.jpg',
        '/img/gallery/upload_4dc010b455294984b254f4a0b7b56883.jpg',
        '/img/gallery/upload_d57bbfb4fb56af313f5080b53077cef9.jpg',
        '/img/gallery/upload_921ddcbddba71dbc5537b7e86ad34fd6.jpg',
        '/img/gallery/upload_7b9030b702a68ee655a0a2985754c688.jpg',
        '/img/gallery/upload_1d6fc84ba6791e00612be0552e1be4ea.jpg',
        '/img/gallery/upload_7bcdf266570801870a44e17d109157fa.jpg',
        '/img/gallery/upload_f31cd2783d766ab96cef8b759fcffbc8.jpg',
        '/img/gallery/upload_7bf30b56b780084d8003e5706e09eb66.jpg',
        '/img/gallery/upload_218718066ba7d64b00dc8f4dd454f4b6.jpg',
        '/img/gallery/upload_25cf52e43765512269df1a48be1f2603.jpg',
        '/img/gallery/upload_99f6a12810b401fb05f7881a941562f5.jpg',
        '/img/gallery/upload_3d72cf4a8bb8bae5daddf504efc44ad3.jpg',
        '/img/gallery/upload_726ad090cf8ccdd4798734172fc93f35.jpg',
        '/img/gallery/upload_c4f482d221704bfe44f6622479a03e27.jpg',
        '/img/gallery/upload_ddde58314b166291dcfe5fc026343eeb.jpg',
        '/img/gallery/upload_ae63451df5f58ba32c6f175ebb557ec8.jpg',
      ],
      path: [
        '/img/path/upload_ccfc1f8ee7412b86aaf376b88feb70d7.jpg',
        '/img/path/upload_c4462c9c0886725eb818cd286a80c7c2.jpg',
        '/img/path/upload_52e718953418109dad7ff666ba92f52f.jpg',
      ],
    }
  )
    .then(() => res.status(200).json('Фотографии добавлены'))
    .catch(err => res.status(400).json(err));
};
const addSiteSections = (req, res) => {
  const { site } = req.body;
  const sectionImages = new SectionImages({
    site,
  });
  sectionImages.save(err => {
    if (err) res.status(400).json(err);
    res.status(200).json(sectionImages);
  });
};

const sectionPhotos = (req, res) => {
  const { site, section } = req.body;
  const query = {};
  query[section] = 1;
  query._id = 0;
  SectionImages.find({ site }, query).then(images => {
    res.status(200).json(images[0][section]);
  });
};

const siteContent = (req, res) => {
  const { site } = req.body;
  SectionImages.find(
    { site },
    {
      _id: 0,
      site: 0,
      __v: 0,
      projects: 0,
    }
  ).then(images => {
    res.status(200).json(images[0]);
  });
};
const deletePhoto = (req, res) => {
  const { site, section, photo } = req.body;
  const query = {};
  query[section] = photo;
  SectionImages.update({ site }, { $pull: query }).then(() => {
    res.status(200).json('фотография удалена');
  });
};

const reorderPhotos = (req, res) => {
  const { photos, section, site } = req.body;
  SectionImages.findOneAndUpdate(site, { $set: { [section]: photos } })
    .then(() => res.status(200).json('Данные обновлены'))
    .catch(err => res.status(400).json(err));
};

const updatePhoto = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.json({
        result: 'failed',
        data: {},
        message: `Cannot upload images. Error is : ${err}`,
      });
    }
    const { site, section, oldPhoto } = fields;
    const { file } = files;
    let imageSize = 900;
    if (section === 'carousel') imageSize = 900;
    else if (section === 'genPlan') imageSize = 900;
    else if (section === 'advertising') imageSize = 900;
    else if (section === 'gallery') imageSize = 930;
    else if (section === 'path') imageSize = 280;
    return imagemin([file.path], `./${site}/img/${section}`, {
      plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })],
    })
      .then(images =>
        images.forEach(image => {
          sharp(image.data)
            .resize(imageSize)
            .toFile(image.path);
        })
      )
      .then(() => {
        SectionImages.aggregate([
          { $match: { site } },
          {
            $project: {
              _id: 0,
              [section]: {
                $indexOfArray: [`$${section}`, oldPhoto],
              },
            },
          },
        ]).then(result => {
          // console.log(result);
          const imageIndex = `${section}.${result[0][section]}`;
          const imageRoute = `/img/${section}${file.path.substring(
            file.path.lastIndexOf('/')
          )}`;
          SectionImages.findOneAndUpdate(
            { site },
            {
              $set: {
                [imageIndex]: imageRoute,
              },
            },
            { new: true }
          )
            // .then(SectionImages.findOne({ site }))
            .then(result =>
              setTimeout(() => {
                res.status(200).json(result[section]);
              }, 2000)
            )
            .then(() => {
              fs.unlink(file.path, err => {
                if (err) {
                  console.error('here', err.toString());
                }
              });
            })
            .catch(err => console.log(err));
        });
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
  reorderPhotos,
  addDefaultPhotos,
  clearAll,
};
