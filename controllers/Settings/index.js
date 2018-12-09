const mongoose = require("mongoose");
const connectionString = `mongodb://localhost:27017/TenantsDB`;

const isCorrectEmail = email => {
  let regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
};

const getEmailService = email => email.match(/(?<=@)[^.]+(?=\.)/g).join("");
mongoose.connect(connectionString);
const db = mongoose.connection;
const UserSettings = require("../../Schemas/UserSettings");

db.on("error", console.error.bind(console, "connection error:"));

const changeAccountPassword = (req, res) => {
  const { user, currentPassword, newPassword } = req.body;
  UserSettings.findOne({ user: user }, "password", (err, dbRes) => {
    if (dbRes.password === currentPassword) {
      UserSettings.findOneAndUpdate(user, {
        $set: { password: newPassword }
      })
        .then(() => res.status(200).json("Данные обновлены"))
        .catch(err => res.status(400).json(err));
    } else {
      res.status(400).json("Неправильный пароль");
    }
  });
};

getEmailService("firstname@google.com");
const updateEmailCredentials = (req, res) => {
  const { user, email, password,phone } = req.body;
  if (isCorrectEmail(email)) {
    UserSettings.findOneAndUpdate(user, {
      $set: {
        phone:phone,
        MAIL: {
          USER: email,
          PASSWORD: password,
          SERVICE: getEmailService(email)
        }
      }
    })
      .then(() => res.status(200).json("Данные обновлены"))
      .catch(err => res.status(400).json(err));
  } else {
    res.status(400).json("Введен неправильный Email");
  }
};

module.exports = {
  changeAccountPassword,
  updateEmailCredentials
};
