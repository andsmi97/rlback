const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminJpegoptim = require("imagemin-jpegoptim");

const compress = imagemin(["./Uploads/*.{jpg,jpeg,png}"], "./Compressed", {
  plugins: [
    imageminJpegtran(),
    imageminPngquant({ quality: "65-80" }),
    imageminJpegoptim({ max: 50 })
  ]
});
module.exports = {
  compress
};

// console.log(files);
//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
