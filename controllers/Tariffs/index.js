const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const UserSettings = require('../../Schemas/UserSettings');

const changeTariffs = (req, res) => {
  const { user, gas } = req.body;
  UserSettings.findOneAndUpdate(user, { $set: { tariffs: { gas } } })
    .then(() => res.status(200).json('Данные обновлены'))
    .catch(err => res.status(400).json(err));
};

module.exports = {
  changeTariffs,
};
