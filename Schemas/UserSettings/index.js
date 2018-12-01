const mongoose = require("mongoose");
// const connectionString = `mongodb://localhost:27017/TenantsDB`;
// mongoose.connect(connectionString);
// const db = mongoose.connection;
const userSettings = new mongoose.Schema({
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
// const UserSettings = mongoose.model("UserSettings", userSettings);
module.exports = mongoose.model("UserSettings", userSettings);