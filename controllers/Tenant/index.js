const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const db = mongoose.connection;

const Tenant = require('../../Schemas/Tenants');

db.on('error', console.error.bind(console, 'connection error:'));

const isCorrectEmail = (email) => {
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
};
const isHouseInRange = (number, min, max) => {
  if (!min) {
    min = 0;
  }
  if (!max) {
    max = 56;
  }
  return number > min && number <= max;
};
const isNameCorrect = (name) => {
  const regExp = /^((?:[а-яА-ЯёЁ]+\s){2}[а-яА-ЯёЁ]+)$/g;
  return regExp.test(name);
};
const compareKeys = (a, b) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};
const getReqErrors = (req, expectedReq) => {
  const error = [];
  if (compareKeys(req, expectedReq)) {
    error.push('Неверные данные');
  }
  if ({}.hasOwnProperty.call(req, 'email')) {
    if (!isCorrectEmail(req.email)) {
      error.push('Неверный формат email');
    }
  }
  if ({}.hasOwnProperty.call(req, 'houseNumber')) {
    if (!isHouseInRange(req.houseNumber)) {
      error.push('Неверный номер дома');
    }
  }
  if ({}.hasOwnProperty.call(req, 'name')) {
    if (!isNameCorrect(req.name)) {
      error.push('Неверный формат имени');
    }
  }
  return error;
};
const isArrayEmpty = array => !!(Array.isArray(array) && !array.length);
const isErrors = errors => !isArrayEmpty(errors);
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

const handleInsert = (req, res) => {
  const { name, email, houseNumber } = req.body;
  const expectedReq = {
    name: '',
    email: '',
    houseNumber: 0,
  };
  const errors = getReqErrors(req, expectedReq);
  if (!isErrors(errors)) {
    const newTenant = new Tenant({
      houseNumber,
      email,
      name,
    });
    return newTenant.save((err) => {
      if (err) {
        return res.status(400).json(err);
      }
      return Tenant.find({})
        .then(post => res.status(200).json(post))
        .catch(err => res.status(400).json(err));
    });
  }
  return res.status(400).json(errors);
};

const handleUpdate = (req, res) => {
  const { name, email, houseNumber } = req.body;
  const expectedReq = {
    name: '',
    email: '',
    houseNumber: 0,
  };

  const errors = getReqErrors(req, expectedReq);
  if (!isErrors(errors)) {
    Tenant.findOneAndUpdate(
      {
        houseNumber,
      },
      {
        $set: {
          name,
          email,
        },
      },
      () => {
        Tenant.find()
          .then(tenant => res.status(200).json(tenant))
          .catch(err => res.status(400).json(err));
      }
    );
  } else {
    res.status(400).json(errors);
  }
};

const handleDelete = (req, res) => {
  const { houseNumber } = req.body;
  const expectedReq = {
    houseNumber: 0,
  };
  const errors = getReqErrors(req, expectedReq);
  if (!isErrors(errors)) {
    Tenant.findOneAndDelete({ houseNumber }, (err) => {
      if (err) res.status(400).json(err);
      Tenant.find()
        .then(tenant => res.status(200).json(tenant))
        .catch(err => res.status(400).json(err));
    });
  } else {
    res.status(400).json(errors);
  }
};

const handleSelect = (req, res) => {
  Tenant.find({})
    .then(tenants => res.status(200).json(tenants))
    .catch(err => res.status(400).json(err));
};

module.exports = {
  handleInsert,
  handleUpdate,
  handleDelete,
  handleSelect,
};
