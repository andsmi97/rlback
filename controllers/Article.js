const Article = require('../Schemas/Article');

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
    const response = await Article.find({ type }, null, {
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
