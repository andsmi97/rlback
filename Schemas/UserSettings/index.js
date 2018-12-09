const mongoose = require("mongoose");
const userSettings = new mongoose.Schema({
    user: { type: String, unique: true, required: true, dropDups: true },
    password: { type: String, required: true },
    phone: {type: String, required: true},
    MAIL: {
        USER: String,
        PASSWORD: String,
        SERVICE: String
    },
    tariffs: {
        gas: { type: Number, default: 0 }
    }
});
module.exports = mongoose.model("UserSettings", userSettings);