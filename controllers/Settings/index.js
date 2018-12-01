// const config = require("../../config");
const mongoose = require("mongoose");
// const connectionString = `mongodb://${config.DB.LOGIN}:${
//   config.DB.PASSWORD
// }@freecluster-shard-00-00-rec05.mongodb.net:27017,freecluster-shard-00-01-rec05.mongodb.net:27017,freecluster-shard-00-02-rec05.mongodb.net:27017/test?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin&retryWrites=true/${
//   config.DB.NAME
// }`;

const connectionString = `mongodb://localhost:27017/TenantsDB`;

const isCorrectEmail = email => {
  let regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
};

const getEmailService = email => email.match(/(?<=@)[^.]+(?=\.)/g).join("");
mongoose.connect(connectionString);
const db = mongoose.connection;
let userSettings = new mongoose.Schema({
  user: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, required: true },
  MAIL: {
    USER: String,
    PASSWORD: String,
    SERVICE: String
  },
  tariffs: {
    gas: Number
  }
});

db.on("error", console.error.bind(console, "connection error:"));

const changeAccountPassword = (req, res) => {
  console.log(req.body);
  const { user, currentPassword, newPassword } = req.body;
  let UserSettings = mongoose.model("UserSettings", userSettings);
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
  const { user, email, password } = req.body;
  if (isCorrectEmail(email)) {
    let UserSettings = mongoose.model("UserSettings", userSettings);
    UserSettings.findOneAndUpdate(user, {
      $set: {
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
