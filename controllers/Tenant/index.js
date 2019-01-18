const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const db = mongoose.connection;

const Tenant = require('../../Schemas/Tenants');

db.on('error', console.error.bind(console, 'connection error:'));

const validateInsert = [
  body('name')
    .custom((name) => {
      const regExp = /^((?:[а-яА-ЯёЁ]+\s){2}[а-яА-ЯёЁ]+)$/g;
      return regExp.test(name);
    })
    .withMessage('Необходимо ввести Фамилию Имя Отчество на русском языке'),
  body('email')
    .isEmail()
    .withMessage('Введите правильный email'),
  body('houseNumber')
    .custom(houseNumber => Tenant.find({ houseNumber }).then((tenant) => {
      if (tenant.length) {
        return Promise.reject('В данном доме уже есть жилец');
      }
      return Promise.resolve();
    }))
    .isNumeric()
    .withMessage('Номер дома - число'),
];

const validateUpdate = [
  body('name')
    .custom((name) => {
      const regExp = /^((?:[а-яА-ЯёЁ]+\s){2}[а-яА-ЯёЁ]+)$/g;
      return regExp.test(name);
    })
    .withMessage('Имя должно быть на русском языке'),
  body('email')
    .isEmail()
    .withMessage('Введите правильный email'),
  body('houseNumber')
    .isNumeric()
    .withMessage('Номер дома - число')
    .custom(houseNumber => Tenant.find({ houseNumber }).then((tenant) => {
      if (!tenant.length) {
        return Promise.reject('В данном нет жильца');
      }
      return Promise.resolve();
    })),
];

const validateRemove = [
  body('houseNumber')
    .isNumeric()
    .withMessage('Номер дома - число'),
];

const backUpTenants = (tenants) => {
  const date = new Date();
  const fileToWrite = date
    .toString()
    .slice(4, 24)
    .split(' ')
    .join('-')
    .split(':')
    .join('_')
    .concat('.json');
  fs.writeFile(
    path.join(__dirname, `../../tenants/${fileToWrite}`),
    JSON.stringify(tenants),
    (err) => {
      if (err) throw err;
      console.log('file saved');
    }
  );
};

const insert = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { name, email, houseNumber } = req.body;
  const newTenant = new Tenant({ houseNumber, email, name });
  return newTenant.save((err) => {
    if (err) {
      return res.status(400).json(err);
    }
    return Tenant.find({})
      .then(post => res.status(200).json(post))
      .catch(err => res.status(400).json(err));
  });
};

const update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { name, email, houseNumber } = req.body;
  return Tenant.findOneAndUpdate(
    { houseNumber },
    { $set: { name, email } },
    () => Tenant.find()
      .then(tenant => res.status(200).json(tenant))
      .catch(err => res.status(400).json(err))
  );
};

const remove = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { houseNumber } = req.body;
  return Tenant.findOneAndDelete({ houseNumber }, (err) => {
    if (err) res.status(400).json(err);
    Tenant.find()
      .then(tenant => res.status(200).json(tenant))
      .catch(err => res.status(400).json(err));
  });
};

const select = (req, res) => {
  Tenant.find({})
    .then(tenants => res.status(200).json(tenants))
    .catch(err => res.status(400).json(err));
};

module.exports = {
  insert,
  update,
  remove,
  select,
  validateInsert,
  validateUpdate,
  validateRemove,
};
