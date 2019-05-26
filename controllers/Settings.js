const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/TenantsDB';

const isCorrectEmail = email => {
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
};

const getEmailService = email => email.match(/(?<=@)[^.]+(?=\.)/g).join('');
mongoose.connect(connectionString);
const db = mongoose.connection;
const User = require('../Schemas/User');

db.on('error', console.error.bind(console, 'connection error:'));

const changeAccountPassword = async (req, res) => {
  const { user, currentPassword, newPassword } = req.body;
  try {
    const dbPassword = User.findOne({ user }, 'password').password;
    if (dbPassword === currentPassword) {
      await User.findOneAndUpdate(user, {
        $set: { password: newPassword },
      });
      return res.sendStatus(203);
    } else {
      return res.status(400).json('Неправильный пароль');
    }
  } catch (e) {
    return res.status(403);
  }
};

const updateEmailCredentials = async (req, res) => {
  const { user, email, password, phone, phone2 } = req.body;
  try {
    if (isCorrectEmail(email)) {
      await User.findOneAndUpdate(user, {
        $set: {
          phone,
          phone2,
          MAIL: {
            USER: email,
            PASSWORD: password,
            SERVICE: getEmailService(email),
          },
        },
      });
      res.sendStatus(203);
    } else {
      return res.status(400).json('Введен неправильный Email');
    }
  } catch (e) {
    return res.sendStatus(403);
  }
};

module.exports = {
  changeAccountPassword,
  updateEmailCredentials,
};
