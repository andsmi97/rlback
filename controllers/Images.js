const formidable = require('formidable');
const sharp = require('sharp');
const path = require('path');
const uuid = require('uuidv4');
const fs = require('fs');
const upload = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../Uploads');
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  return form.parse(req, (err, fields, files) => {
    const { file } = files;
    if (err) return res.sendStatus(403);
    if (file) {
      const outputFile = `./assets/img/${uuid()}.jpg`;
      return sharp(file.path)
        .resize(700)
        .jpeg({ quality: 90 })
        .toFile(outputFile)
        .then(() => {
          res.status(200).json({
            url:`${outputFile.slice(1)}`,
          });
          fs.unlink(file.path, err => {
            if (err) console.error(err.toString());
          });
        });
    }
  });
};

module.exports = {
  upload,
};
