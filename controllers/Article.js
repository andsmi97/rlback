const mongoose = require('mongoose');
const Article = require('../Schemas/Article');
const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// const trancuateArticle = article => {
//   console.log(article);
//   console.log(article.body.match(/<p(.)>.*?<\/p\1>/g));
// const parser = new DOMParser();
// console.log('parser created');
// console.log(article._doc.body);
// console.log([
//   ...parser.parseFromString(article._doc.body, 'text/html').childNodes,
// ]);
// console.log({
//   ...article,
//   body: [
//     ...new DOMParser().parseFromString(article.body, 'text/html').body
//       .children,
//   ]
//     .reduce(
//       (acc, item, index) => (index <= 2 ? [...acc, item.outerHTML] : acc),
//       []
//     )
//     .join(''),
// });
// return { ...article._doc };
// return {
//   ...article,
//   body: [
//     ...new DOMParser().parseFromString(article.body, 'text/html').body
//       .children,
//   ]
//     .reduce(
//       (acc, item, index) => (index <= 2 ? [...acc, item.outerHTML] : acc),
//       []
//     )
//     .join(''),
// };
// };

const create = async (req, res) => {
  try {
    const { body, type } = req.body;
    const author = req.payload.id;
    const article = new Article({ body, type, author });
    return res.status(200).json(await article.save());
  } catch (e) {
    return res.status(403);
  }
};

const update = async (req, res) => {
  try {
    const { body } = req.body;
    const { id } = req.params;
    return res
      .status(200)
      .json(await Article.findByIdAndUpdate(id, { body }, { new: true }));
  } catch (e) {
    return res.status(403);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findByIdAndRemove(id).exec();
    return res.sendStatus(204);
  } catch (e) {
    return res.status(403);
  }
};

const all = async (req, res) => {
  try {
    const { type, limit, skip } = req.query;
    const author = req.payload.id;
    const response = await Article.find({ type, author }, null, {
      limit: Number(limit),
      skip: Number(skip),
    })
      .sort({ createdAt: 'desc' })
      .exec();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(403);
  }
};

const one = async (req, res) => {
  try {
    const { id } = req.params;
    const author = req.payload.id;
    return res.status(200).json(await Article.findOne({ _id: id, author }));
  } catch (e) {
    return res.status(403);
  }
};

module.exports = {
  create,
  all,
  remove,
  update,
  one,
};
