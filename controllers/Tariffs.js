const { body, validationResult } = require('express-validator/check');
const Tariff = require('../Schemas/Tariff');

const validateInsert = [
  body('day')
    .isNumeric()
    .withMessage('Тариф дня - число'),
  body('night')
    .isNumeric()
    .withMessage('Тариф ночи - число'),
];

const insert = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { day, night } = req.body;
    const owner = req.payload.id;

    const tariff = new Tariff({ day, night, owner });
    return res.status(200).json(await tariff.save());
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
};

const selectLast = async (req, res) => {
  try {
    const owner = req.payload.id;
    return res
      .status(200)
      .json(
        await Tariff.findOne(
          { owner },
          { owner: 0, __v: 0, updatedAt: 0 }
        ).sort({ createdAt: -1 })
      );
  } catch (e) {
    return res.sendStatus(403);
  }
};

const selectAll = async (req, res) => {
  try {
    const owner = req.payload.id;
    return res.status(200).json(
      await Tariff.find({ owner }, { owner: 0, __v: 0, updatedAt: 0 }).sort({
        createdAt: -1,
      })
    );
  } catch (e) {
    return res.sendStatus(403);
  }
};

module.exports = {
  insert,
  selectLast,
  selectAll,
  validateInsert,
};
