const fs = require('fs');
const path = require('path');

const formidable = require('formidable');
const sharp = require('sharp');
const uuid = require('uuidv4');
const Content = require('../Schemas/Content');

const getImageSize = section => {
  switch (section) {
    case 'carousel':
      return 930;
    case 'genPlan':
      return 930;
    case 'advertising':
      return 430;
    case 'gallery':
      return 940;
    case 'path':
      return 280;
    default:
      return 900;
  }
};
const addPhoto = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  // parse
  return form.parse(req, async (err, fields, files) => {
    const { file } = files;
    const { section } = fields;
    try {
      const owner = req.payload.id;
      if (err) {
        return res.status(403).json('Возникла ошибка при загрузке изображения');
      }
      const imageSize = getImageSize(section);
      const outputFile = `./ozerodom.ru/img/${uuid()}.jpg`;
      await sharp(file.path)
        .resize(imageSize)
        .jpeg({ quality: 95 })
        .toFile(outputFile);
      await Content.findOneAndUpdate(
        { owner },
        {
          $push: {
            [section]:
              process.env.MODE === 'development'
                ? `http://localhost:8082${outputFile.slice(13)}`
                : `${outputFile.slice(1)}`,
          },
        }
      );
      res.status(200).json({
        section,
        content:
          process.env.MODE === 'development'
            ? `http://localhost:8082${outputFile.slice(13)}`
            : `${outputFile.slice(1)}`,
      });
      return fs.unlink(file.path, err => {
        if (err) console.error(err.toString());
      });
    } catch (e) {
      console.log(e);
      return res.sendStatus(403);
    }
  });
};

const clearAll = async (req, res) => {
  const owner = req.payload.id;
  try {
    await Content.findOneAndUpdate(
      { owner },
      {
        carousel: [],
        advertising: [],
        genPlan: [],
        gallery: [],
        path: [],
      }
    );
    return res.status(204);
  } catch (e) {
    res.sendStatus(403);
  }
};

const addDefaultPhotos = async (req, res) => {
  const owner = req.payload.id;
  try {
    let insertedContent = (process.env.MODE = 'development'
      ? {
          site: 'ozerodom.ru',
          owner,
          carousel: [
            'http://localhost:8082/img/carousel/upload_fb005863b2350e338bcb8b6c00ba9086.jpg',
            'http://localhost:8082/img/carousel/upload_9990a8483163608b1b60096fa9b49825.jpg',
            'http://localhost:8082/img/carousel/upload_4310b8dbd19ca7da0718b476d2ee3daf.jpg',
            'http://localhost:8082/img/carousel/upload_c9f08397461feb07d26db4273eec8916.jpg',
            'http://localhost:8082/img/carousel/upload_7c9e14a8110283b54656a57598dda86b.jpg',
            'http://localhost:8082/img/carousel/upload_e902be5e28caa6502c295a975a12f87a.jpg',
            'http://localhost:8082/img/carousel/upload_fa6fce75b11c99ba167d0f31eb5f8033.jpg',
            'http://localhost:8082/img/carousel/upload_7b8eab5bce7e8784d7403988dbd36f72.jpg',
          ],
          advertising: [
            'http://localhost:8082/img/advertising/upload_1cacee3559dd230caac045182e2ea0fb.jpg',
            'http://localhost:8082/img/advertising/upload_8db617adfa0f47253b49c7f37c647094.jpg',
          ],
          genPlan: [
            'http://localhost:8082/img/genPlan/upload_99db0a243ecd64a2d310b597e249be5e.png',
            'http://localhost:8082/img/genPlan/upload_223b7bb8af66a693c8adda76150c24e0.jpg',
          ],
          gallery: [
            'http://localhost:8082/img/gallery/upload_36a957b9e88666430d7fd072592da08b.jpg',
            'http://localhost:8082/img/gallery/upload_e481bf6db2f3955338652b77634ea5a6.jpg',
            'http://localhost:8082/img/gallery/upload_14caf66a0e0f1b79a6a9c09d42cdcad0.jpg',
            'http://localhost:8082/img/gallery/upload_ed1fa7e6d1fa0a1521f582877da6ba83.jpg',
            'http://localhost:8082/img/gallery/upload_5b0ce4d5f3e7e1ee9ab03a74459d281d.jpg',
            'http://localhost:8082/img/gallery/upload_c02e69d224894d2791e0e2c97d7fded1.jpg',
            'http://localhost:8082/img/gallery/upload_937205a0b9351f9582ef3df18c134cbe.jpg',
            'http://localhost:8082/img/gallery/upload_41c7b2f68fb14a82f3e735c68e4d4329.jpg',
            'http://localhost:8082/img/gallery/upload_73533615d8dda160109ae58679e7bd32.jpg',
            'http://localhost:8082/img/gallery/upload_0e8db607de012b6b8724d772ab990786.jpg',
            'http://localhost:8082/img/gallery/upload_6a5568b60a5d63b24e1a6dd8f20d2d6b.jpg',
            'http://localhost:8082/img/gallery/upload_7623d82508be070f689ded0112602288.jpg',
            'http://localhost:8082/img/gallery/upload_6234f179803f1270e3cc38be0c81575b.jpg',
            'http://localhost:8082/img/gallery/upload_24d8f833108e3374dbf3ca30d481cc6c.jpg',
            'http://localhost:8082/img/gallery/upload_285d0e76230156777ae1d90bf785c74e.jpg',
            'http://localhost:8082/img/gallery/upload_6d02e8e5a12c28fb909e1a432525a9ac.jpg',
            'http://localhost:8082/img/gallery/upload_42cd3d3a597189db29f622659561cea8.jpg',
            'http://localhost:8082/img/gallery/upload_cf968d9e298b2e7202406d5e229c7329.jpg',
            'http://localhost:8082/img/gallery/upload_7215fb0489c54a8d82b626f584f5bd5c.jpg',
            'http://localhost:8082/img/gallery/upload_3c5f3b791e8520f53d6b808673234461.jpg',
            'http://localhost:8082/img/gallery/upload_d40ae76d853f91c96f92ce170a033217.jpg',
            'http://localhost:8082/img/gallery/upload_5b2d72368b5435937e635444ede0e5ab.jpg',
          ],
          path: [
            'http://localhost:8082/img/path/upload_ccfc1f8ee7412b86aaf376b88feb70d7.jpg',
            'http://localhost:8082/img/path/upload_c4462c9c0886725eb818cd286a80c7c2.jpg',
            'http://localhost:8082/img/path/upload_52e718953418109dad7ff666ba92f52f.jpg',
          ],
        }
      : {
          site: 'ozerodom.ru',
          owner,
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
          gallery: [
            '/img/gallery/upload_36a957b9e88666430d7fd072592da08b.jpg',
            '/img/gallery/upload_e481bf6db2f3955338652b77634ea5a6.jpg',
            '/img/gallery/upload_14caf66a0e0f1b79a6a9c09d42cdcad0.jpg',
            '/img/gallery/upload_ed1fa7e6d1fa0a1521f582877da6ba83.jpg',
            '/img/gallery/upload_5b0ce4d5f3e7e1ee9ab03a74459d281d.jpg',
            '/img/gallery/upload_c02e69d224894d2791e0e2c97d7fded1.jpg',
            '/img/gallery/upload_937205a0b9351f9582ef3df18c134cbe.jpg',
            '/img/gallery/upload_41c7b2f68fb14a82f3e735c68e4d4329.jpg',
            '/img/gallery/upload_73533615d8dda160109ae58679e7bd32.jpg',
            '/img/gallery/upload_0e8db607de012b6b8724d772ab990786.jpg',
            '/img/gallery/upload_6a5568b60a5d63b24e1a6dd8f20d2d6b.jpg',
            '/img/gallery/upload_7623d82508be070f689ded0112602288.jpg',
            '/img/gallery/upload_6234f179803f1270e3cc38be0c81575b.jpg',
            '/img/gallery/upload_24d8f833108e3374dbf3ca30d481cc6c.jpg',
            '/img/gallery/upload_285d0e76230156777ae1d90bf785c74e.jpg',
            '/img/gallery/upload_6d02e8e5a12c28fb909e1a432525a9ac.jpg',
            '/img/gallery/upload_42cd3d3a597189db29f622659561cea8.jpg',
            '/img/gallery/upload_cf968d9e298b2e7202406d5e229c7329.jpg',
            '/img/gallery/upload_7215fb0489c54a8d82b626f584f5bd5c.jpg',
            '/img/gallery/upload_3c5f3b791e8520f53d6b808673234461.jpg',
            '/img/gallery/upload_d40ae76d853f91c96f92ce170a033217.jpg',
            '/img/gallery/upload_5b2d72368b5435937e635444ede0e5ab.jpg',
          ],
          path: [
            '/img/path/upload_ccfc1f8ee7412b86aaf376b88feb70d7.jpg',
            '/img/path/upload_c4462c9c0886725eb818cd286a80c7c2.jpg',
            '/img/path/upload_52e718953418109dad7ff666ba92f52f.jpg',
          ],
        });
    const content = new Content(insertedContent);
    await content.save();
    return res.sendStatus(204);
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
};

//probably worthless
const addSiteSections = async (req, res) => {
  const { site } = req.body;
  const content = new Content({ site });
  try {
    return res.status(200).json(await content.save());
  } catch (e) {
    return res.status(403);
  }
};

//could be used later
const sectionPhotos = async (req, res) => {
  const { section } = req.body;
  const owner = req.payload.id;
  try {
    const images = await Content.findOne({ owner }, { [section]: 1, _id: 0 });
    return res.status(200).json(images[section]);
  } catch (e) {
    return res.sendStatus(403);
  }
};

const siteContent = async (req, res) => {
  const { site } = req.query;
  try {
    const content = await Content.findOne(
      { site },
      { _id: 0, site: 0, __v: 0, owner: 0 }
    );
    return res.status(200).json(content);
  } catch (e) {
    return res.sendStatus(403);
  }
};

const deletePhoto = async (req, res) => {
  const { section, photo } = req.query;
  const owner = req.payload.id;
  try {
    await Content.update({ owner }, { $pull: { [section]: photo } });
    return res.sendStatus(204);
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
};

const reorderPhotos = async (req, res) => {
  const { from, to, section } = req.body;
  try {
    const owner = req.payload.id;
    //Trying to reorer images in mongodb array
    //Probably shitty algorithm, can be changed with mongoose syntax
    let content = await Content.findOne({ owner });
    content[section].splice(to, 0, content[section].splice(from, 1)[0]);
    await Content.findOneAndUpdate(
      { owner },
      { $set: { [section]: content[section] } }
    );
    return res.sendStatus(204);
  } catch (e) {
    //TODO: Send to log
    console.log(e);

    return res.sendStatus(403);
  }
};

const updatePhoto = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.sendStatus(403);
    }
    const { section, index } = fields;
    const { file } = files;
    const owner = req.payload.id;
    const imageSize = getImageSize(section);
    const outputFile = `./ozerodom.ru/img/${section}/${uuid()}.jpg`;

    await sharp(file.path)
      .resize(imageSize)
      .jpeg({ quality: 95 })
      .toFile(outputFile);

    const imageIndex = `${section}.${index}`;
    const data = await Content.findOneAndUpdate(
      { owner },
      {
        $set: {
          [imageIndex]:
            process.env.MODE === 'development'
              ? `http://localhost:8082${outputFile.slice(13)}`
              : `${outputFile.slice(13)}`,
        },
      },
      { new: true }
    );
    //TODO: change late. Bad design, giving time to proceed image
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(res.status(200).json(data[section])), 2000);
    });
    await promise;
    return fs.unlink(file.path, err => {
      if (err) {
        console.error('here', err.toString());
      }
    });
  });
};
const changeSalesText = async (req, res) => {
  try {
    const owner = req.payload.id;
    const { salesText } = req.body;
    console.log(owner);
    console.log(salesText);
    await Content.findOneAndUpdate({ owner }, { salesText });
    return res.sendStatus(204);
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
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
  changeSalesText,
};
