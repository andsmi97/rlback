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
    gas: { type: Number, default: 0 }
  }
});

db.on("error", console.error.bind(console, "connection error:"));

const changeAccountPassword = (req, res) => {
  console.log(req.body);
  const { user, currentPassword, newPassword } = req.body;
};

const addUser = (req, res) => {
  const { user, password, mailuser, mailpassword } = req.body;
  let UserSettings = mongoose.model("UserSettings", userSettings);
  let settings = new UserSettings({
    user: user,
    password: password,
    MAIL: {
      USER: mailuser,
      PASSWORD,
      mailpassword,
      SERVICE: getEmailService(mailuser)
    }
  });
  settings.save(err => {
    if (err) res.status(400).json("Возникла ошибка при вставке");
    res.status(200).json(settings);
  });
};
const login = (req, res) => {
  const { user, password } = req.body;
  let Config = mongoose.model("config", userSettings);
  Config.findOne({ user, password }, "password", (err, dbRes) => {
    console.log(dbRes);
    if (dbRes !== null) {
      res.status(200).json(dbRes._id);
    } else {
      res.status(400).json(err);
    }
  });
};
module.exports = {
  login,
  addUser
};
