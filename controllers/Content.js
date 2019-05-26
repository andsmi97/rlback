const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const formidable = require('formidable');
const sharp = require('sharp');
const uuid = require('uuidv4');
const Content = require('../Schemas/Sections');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

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
        .jpeg({ quality: 90 })
        .toFile(outputFile);
      await Content.findOneAndUpdate(
        { owner },
        { $push: { [section]: outputFile.slice(1) } }
      );
      res.status(200).json({
        section,
        content:
          process.env.MODE === 'development'
            ? `http://localhost:8080${outputFile.slice(1)}`
            : `${outputFile.slice(1)}`,
      });
      return fs.unlink(file.path, err => {
        if (err) console.error(err.toString());
      });
    } catch (e) {
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
            'http://localhost:8080/img/carousel/upload_fb005863b2350e338bcb8b6c00ba9086.jpg',
            'http://localhost:8080/img/carousel/upload_9990a8483163608b1b60096fa9b49825.jpg',
            'http://localhost:8080/img/carousel/upload_4310b8dbd19ca7da0718b476d2ee3daf.jpg',
            'http://localhost:8080/img/carousel/upload_c9f08397461feb07d26db4273eec8916.jpg',
            'http://localhost:8080/img/carousel/upload_7c9e14a8110283b54656a57598dda86b.jpg',
            'http://localhost:8080/img/carousel/upload_e902be5e28caa6502c295a975a12f87a.jpg',
            'http://localhost:8080/img/carousel/upload_fa6fce75b11c99ba167d0f31eb5f8033.jpg',
            'http://localhost:8080/img/carousel/upload_7b8eab5bce7e8784d7403988dbd36f72.jpg',
          ],
          advertising: [
            'http://localhost:8080/img/advertising/upload_1cacee3559dd230caac045182e2ea0fb.jpg',
            'http://localhost:8080/img/advertising/upload_8db617adfa0f47253b49c7f37c647094.jpg',
          ],
          genPlan: [
            'http://localhost:8080/img/genPlan/upload_99db0a243ecd64a2d310b597e249be5e.png',
            'http://localhost:8080/img/genPlan/upload_223b7bb8af66a693c8adda76150c24e0.jpg',
          ],
          gallery: [
            'http://localhost:8080/img/gallery/upload_00d74a036a7b06a24b2729f36587af3e.jpg',
            'http://localhost:8080/img/gallery/upload_0a2f595e3b1205891020e0f67baeab7a.jpg',
            'http://localhost:8080/img/gallery/upload_0e98ca0db096c5e3606679544613c243.jpg',
            'http://localhost:8080/img/gallery/upload_02fa149d8f437b48d1f89a446cfefb4b.jpg',
            'http://localhost:8080/img/gallery/upload_5cb15c81d8ebbd354caa3bb37517d720.jpg',
            'http://localhost:8080/img/gallery/upload_8e0f0ffb547fd90514f7032c21ae3e82.jpg',
            'http://localhost:8080/img/gallery/upload_11f61ae258c2992ffb8465514592a837.jpg',
            'http://localhost:8080/img/gallery/upload_37bdde8584132d3d18475dd37c107430.jpg',
            'http://localhost:8080/img/gallery/upload_73f730205a6af361df4a73d52c3f85fa.jpg',
            'http://localhost:8080/img/gallery/upload_74fa64d4fd10fb2bf65c54977710c70b.jpg',
            'http://localhost:8080/img/gallery/upload_86ad1e0ff740593f71f2fae79513c4fd.jpg',
            'http://localhost:8080/img/gallery/upload_087f9ba0b6cc8daa4d95d0f6c5b8d737.jpg',
            'http://localhost:8080/img/gallery/upload_61193011814df5dc59f83718f35676de.jpg',
            'http://localhost:8080/img/gallery/upload_a6257a4137347fa6fea5ae5a4f819ffa.jpg',
            'http://localhost:8080/img/gallery/upload_a582752b49814c1b4a32df20d620f923.jpg',
            'http://localhost:8080/img/gallery/upload_ae63451df5f58ba32c6f175ebb557ec8.jpg',
            'http://localhost:8080/img/gallery/upload_b15fc5200b7eb21fae1a0ed0f769483a.jpg',
            'http://localhost:8080/img/gallery/upload_c914cb1bef8e50103340f754b0066b10.jpg',
            'http://localhost:8080/img/gallery/upload_c880906e9f86e3a3d34f1c460a907fd2.jpg',
            'http://localhost:8080/img/gallery/upload_cbee19f684785db71e1ac4a03a8e3e4f.jpg',
            'http://localhost:8080/img/gallery/upload_cf0e1f131a0267e4867ac81912273a93.jpg',
            'http://localhost:8080/img/gallery/upload_d6c7fef8c73b8a835b87ad56dedb6e24.jpg',
            'http://localhost:8080/img/gallery/upload_e3fcd4fa95d186bc89c2965bb8c22eb8.jpg',
            'http://localhost:8080/img/gallery/upload_e160627a5703125f806f7528abb7909d.jpg',
            'http://localhost:8080/img/gallery/upload_f8ae7be75e2d9faae00abc84fa06b536.jpg',
            'http://localhost:8080/img/gallery/upload_fbf01bf689c57dda1a901b69c5c7f89e.jpg',
          ],
          path: [
            'http://localhost:8080/img/path/upload_ccfc1f8ee7412b86aaf376b88feb70d7.jpg',
            'http://localhost:8080/img/path/upload_c4462c9c0886725eb818cd286a80c7c2.jpg',
            'http://localhost:8080/img/path/upload_52e718953418109dad7ff666ba92f52f.jpg',
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
            '/img/gallery/upload_00d74a036a7b06a24b2729f36587af3e.jpg',
            '/img/gallery/upload_0a2f595e3b1205891020e0f67baeab7a.jpg',
            '/img/gallery/upload_0e98ca0db096c5e3606679544613c243.jpg',
            '/img/gallery/upload_02fa149d8f437b48d1f89a446cfefb4b.jpg',
            '/img/gallery/upload_5cb15c81d8ebbd354caa3bb37517d720.jpg',
            '/img/gallery/upload_8e0f0ffb547fd90514f7032c21ae3e82.jpg',
            '/img/gallery/upload_11f61ae258c2992ffb8465514592a837.jpg',
            '/img/gallery/upload_37bdde8584132d3d18475dd37c107430.jpg',
            '/img/gallery/upload_73f730205a6af361df4a73d52c3f85fa.jpg',
            '/img/gallery/upload_74fa64d4fd10fb2bf65c54977710c70b.jpg',
            '/img/gallery/upload_86ad1e0ff740593f71f2fae79513c4fd.jpg',
            '/img/gallery/upload_087f9ba0b6cc8daa4d95d0f6c5b8d737.jpg',
            '/img/gallery/upload_61193011814df5dc59f83718f35676de.jpg',
            '/img/gallery/upload_a6257a4137347fa6fea5ae5a4f819ffa.jpg',
            '/img/gallery/upload_a582752b49814c1b4a32df20d620f923.jpg',
            '/img/gallery/upload_ae63451df5f58ba32c6f175ebb557ec8.jpg',
            '/img/gallery/upload_b15fc5200b7eb21fae1a0ed0f769483a.jpg',
            '/img/gallery/upload_c914cb1bef8e50103340f754b0066b10.jpg',
            '/img/gallery/upload_c880906e9f86e3a3d34f1c460a907fd2.jpg',
            '/img/gallery/upload_cbee19f684785db71e1ac4a03a8e3e4f.jpg',
            '/img/gallery/upload_cf0e1f131a0267e4867ac81912273a93.jpg',
            '/img/gallery/upload_d6c7fef8c73b8a835b87ad56dedb6e24.jpg',
            '/img/gallery/upload_e3fcd4fa95d186bc89c2965bb8c22eb8.jpg',
            '/img/gallery/upload_e160627a5703125f806f7528abb7909d.jpg',
            '/img/gallery/upload_f8ae7be75e2d9faae00abc84fa06b536.jpg',
            '/img/gallery/upload_fbf01bf689c57dda1a901b69c5c7f89e.jpg',
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
  const { section, photo } = req.body;
  const owner = req.payload.id;
  try {
    await Content.update({ owner }, { $pull: { [section]: photo } });
    return res.sendStatus(204);
  } catch (e) {
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
    const outputFile = `./ozerodom.ru/img/${uuid()}.jpg`;
    await sharp(file.path)
      .resize(imageSize)
      .jpeg({ quality: 90 })
      .toFile(outputFile);
    const imageIndex = `${section}.${index}`;
    const data = await Content.findOneAndUpdate(
      { owner },
      { $set: { [imageIndex]: outputFile.slice(1) } },
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
