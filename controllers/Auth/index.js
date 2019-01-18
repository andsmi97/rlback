const mongoose = require('mongoose');
const jwt = require('express-jwt');

const connectionString = 'mongodb://localhost:27017/TenantsDB';

const getEmailService = email => email.match(/(?<=@)[^.]+(?=\.)/g).join('');
mongoose.connect(connectionString);
const db = mongoose.connection;
const UserSettings = require('../../Schemas/UserSettings');

db.on('error', console.error.bind(console, 'connection error:'));

const addUser = (req, res) => {
  const {
    user, password, mailuser, mailpassword, phone
  } = req.body;
  const settings = new UserSettings({
    user,
    password,
    phone,
    MAIL: {
      USER: mailuser,
      PASSWORD: mailpassword,
      SERVICE: getEmailService(mailuser),
    },
  });
  settings.save((err) => {
    if (err) res.status(400).json(err);
    res.status(200).json(settings);
  });
};

const getUsers = (req, res) => {
  UserSettings.find().then((users) => {
    res.status(200).json(users);
  });
};

const login = (req, res) => {
  const { user, password } = req.body;
  UserSettings.findOne({ user, password }, 'password', (err, dbRes) => {
    if (dbRes !== null) {
      res.status(200).json(dbRes._id);
    } else {
      res.status(400).json(err);
    }
  });
};
const getContacts = (req, res) => {
  UserSettings.find(
    { user: 'admin' },
    {
      _id: 0,
      phone: 1,
      'MAIL.USER': 1,
      phone2: 1,
    }
  ).then((users) => {
    res.status(200).json(users);
  });
};
const deleteUser = (req, res) => {
  const { user } = req.body;
  UserSettings.findOneAndDelete({ user })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err));
};

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

const { redisClient } = require('../SignIn');

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send('Unauthorized');
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized');
    }
    return next();
  });
};

module.exports = {
  requireAuth,
  login,
  addUser,
  getUsers,
  deleteUser,
  getContacts,
  auth,
};
