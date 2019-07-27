const {
  body,
  validationResult,
  checkSchema,
} = require('express-validator/check');
const Tenant = require('../Schemas/Tenant');

const validateInsert = [
  body('name')
    .custom(name => {
      const regExp = /^((?:[а-яА-ЯёЁ]+\s){2}[а-яА-ЯёЁ]+)$/g;
      return regExp.test(name.trim());
    })
    .withMessage('Необходимо ввести Фамилию Имя Отчество на русском языке'),
  body('email')
    .isEmail()
    .withMessage('Введите правильный email'),
  body('houseNumber')
    .custom(houseNumber =>
      Tenant.find({ houseNumber }).then(tenant => {
        if (tenant.length) {
          return Promise.reject('В данном доме уже есть жилец');
        }
        return Promise.resolve();
      })
    )
    .isNumeric()
    .withMessage('Номер дома - число'),
];

const validateUpdate = [
  body('name')
    .optional()
    .custom(name => {
      const regExp = /^((?:[а-яА-ЯёЁ]+\s){2}[а-яА-ЯёЁ]+)$/g;
      return regExp.test(name);
    })
    .withMessage('Имя должно быть на русском языке'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Введите правильный email'),

  body('houseNumber')
    .optional()
    .isNumeric()
    .withMessage('Номер дома - число'),
];

const validateRemove = checkSchema({
  houseNumber: {
    in: ['params'],
    isInt: true,
    toInt: true,
    errorMessage: 'Номер дома - число',
  },
});

const insert = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { name, email, houseNumber, postIndex, contract, address } = req.body;
    const owner = req.payload.id;
    const tenant = new Tenant({
      houseNumber,
      email,
      name,
      owner,
      postIndex,
      contract,
      address,
    });
    return res.status(200).json(await tenant.save());
  } catch (e) {
    return res.sendStatus(403);
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { _id, ...fields } = req.body;
    return res
      .status(200)
      .json(
        await Tenant.findOneAndUpdate({ _id }, { ...fields }, { new: true })
      );
  } catch (e) {
    return res.sendStatus(403);
  }
};

const remove = async (req, res) => {
  try {
    const { _id } = req.params;
    await Tenant.findOneAndDelete({ _id });
    return res.sendStatus(204);
  } catch (e) {
    return res.sendStatus(403);
  }
};

const select = async (req, res) => {
  try {
    const owner = req.payload.id;
    return res.status(200).json(
      await Tenant.find({ owner })
        .sort({ houseNumber: 1 })
        .populate('documents')
    );
  } catch (e) {
    return res.sendStatus(403);
  }
};
const selectHouses = async (req, res) => {
  try {
    const owner = req.payload.id;
    return res.status(200).json(
      await Tenant.find({ owner })
        .select({ houseNumber: 1, _id: 0, lastDayValue: 1, lastNightValue: 1 })
        .sort({ houseNumber: 1 })
    );
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
};

module.exports = {
  insert,
  update,
  remove,
  select,
  validateInsert,
  validateUpdate,
  validateRemove,
  selectHouses,
};
