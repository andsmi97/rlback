// const config = require("../../config");
const mongoose = require("mongoose");
// const connectionString = `mongodb://${config.DB.LOGIN}:${
//   config.DB.PASSWORD
// }@freecluster-shard-00-00-rec05.mongodb.net:27017,freecluster-shard-00-01-rec05.mongodb.net:27017,freecluster-shard-00-02-rec05.mongodb.net:27017/test?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin&retryWrites=true/${
//   config.DB.NAME
// }`;
const connectionString = `mongodb://localhost:27017/TenantsDB`;
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

const changeTariffs = (req, res) => {
  const { user, gas } = req.body;
  console.log(gas);
  let UserSettings = mongoose.model("UserSettings", userSettings);
  UserSettings.findOneAndUpdate(user, { $set: { tariffs: { gas: gas } } })
    .then(() => res.status(200).json("Данные обновлены"))
    .catch(err => res.status(400).json(err));
};

module.exports = {
  changeTariffs
};
