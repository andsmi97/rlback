const MessageTemplate = require('../Schemas/MessageTemplate');

const create = async (req, res) => {
  try {
    const { subject, message, name } = req.body;
    const owner = req.payload.id;
    const messageTemplate = new MessageTemplate({
      name,
      subject,
      message,
      owner,
    });
    return res.status(200).json(await messageTemplate.save());
  } catch (e) {
    return res.status(403);
  }
};

const update = async (req, res) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;
    const owner = req.payload.id;
    return res
      .status(200)
      .json(
        await MessageTemplate.findOneAndUpdate(
          { _id: id, owner },
          { ...changes },
          { new: true }
        )
      );
  } catch (e) {
    return res.status(403);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await MessageTemplate.findByIdAndRemove(id).exec();
    return res.sendStatus(204);
  } catch (e) {
    return res.status(403);
  }
};

const all = async (req, res) => {
  try {
    const owner = req.payload.id;
    const response = await MessageTemplate.find({ owner })
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
    const owner = req.payload.id;
    return res
      .status(200)
      .json(await MessageTemplate.findOne({ _id: id, owner }));
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
