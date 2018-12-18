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
  console.log(req.body);
  const { user, currentPassword, newPassword } = req.body;
};

const addUser = (req, res) => {
  const { user, password, mailuser, mailpassword, phone } = req.body;
  // let UserSettings = mongoose.model("UserSettings", userSettings);
  let settings = new UserSettings({
    user: user,
    password: password,
    phone: phone,
    MAIL: {
      USER: mailuser,
      PASSWORD: mailpassword,
      SERVICE: getEmailService(mailuser)
    }
  });
  settings.save(err => {
    if (err) res.status(400).json(err);
    res.status(200).json(settings);
  });
};

const getUsers = (req, res) => {
  // let UserSettings = mongoose.model("UserSettings", userSettings);
  UserSettings.find().then(users => {
    res.status(200).json(users);
  });
};

const login = (req, res) => {
  const { user, password } = req.body;
  // let UserSettings = mongoose.model("UserSettings", userSettings);
  UserSettings.findOne({ user, password }, "password", (err, dbRes) => {
    if (dbRes !== null) {
      res.status(200).json(dbRes._id);
    } else {
      res.status(400).json(err);
    }
  });
};
const getContacts = (req,res) =>{
    // let UserSettings = mongoose.model("UserSettings", userSettings);
    UserSettings.find({user:"admin"},{"_id":0,"phone":1, "MAIL.USER":1}).then(users => {
      res.status(200).json(users);
    });
}
const deleteUser = (req, res) => {
  const { user } = req.body;
  let UserSettings = mongoose.model("UserSettings", userSettings);
  UserSettings.findOneAndDelete({ user })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err));
};


module.exports = {
  login,
  addUser,
  getUsers,
  deleteUser,
  getContacts
};
