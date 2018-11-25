const nodemailer = require("nodemailer");
const formidable = require("formidable");
const config = require("../../config");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const connectionString = `mongodb://${config.DB.LOGIN}:${
  config.DB.PASSWORD
}@freecluster-shard-00-00-rec05.mongodb.net:27017,freecluster-shard-00-01-rec05.mongodb.net:27017,freecluster-shard-00-02-rec05.mongodb.net:27017/test?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin&retryWrites=true/${
  config.DB.NAME
}`;

mongoose.connect(
  connectionString,
  { useNewUrlParser: true }
);
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

const getUsersEmails = users => {
  let emails = {};
  for (let key in users) {
    if (users.hasOwnProperty(key)) {
      emails[key] = users[key].email;
    }
  }
  return emails;
};
const recreateTenantsObject = parsedReq => {
  let tenants = {};
  parsedReq.forEach(pair => {
    let num = pair[0].match(/\d+/g).join("");
    let letr = pair[0].match(/[a-zA-Z]+/g).join("");
    if (tenants[num]) {
      tenants[num][letr] = pair[1];
    } else {
      tenants[num] = {};
      tenants[num][letr] = pair[1];
    }
  });
  return tenants;
};

const handleSend = (req, res) => {
  //Распарсить запрос
  // const
  //Проверка данных

  //Обработать сообщение

  //Формировать сообщение

  //Отправить сообщение

  //Сохранить лог

  //Удалить файлы

  //Вернуть ответ
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../uploads");
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; //10 MB
  form.multiples = true;
  form.on("file", (field, file) => {
    fs.rename(file.path, form.uploadDir + "/" + file.name, err => {
      if (err) throw err;
    });
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      response.json({
        result: "failed",
        data: {},
        message: `Cannot upload images. Error is : ${err}`
      });
    }
    let arrayOfFiles = [];
    for (let file in files) {
      arrayOfFiles.push(files[file]);
    }

    //Interpolate to template string
    String.prototype.interpolate = function(params) {
      const names = Object.keys(params);
      const vals = Object.values(params);
      return new Function(...names, `return \`${this}\`;`)(...vals);
    };
    let Config = mongoose.model("config", userSettings);
    Config.findOne({ user: "admin" }, "MAIL", (err, dbRes) => {
      let transporter = nodemailer.createTransport({
        service: dbRes.MAIL.SERVICE,
        auth: {
          user: dbRes.MAIL.USER,
          pass: dbRes.MAIL.PASSWORD
        }
      });
      console.log(recreateTenantsObject(
        Object.entries(fields).filter(field => {
          return field[0] !== "subject" && field[0] !== "message";
        })
      ));
      Object.entries(
        recreateTenantsObject(
          Object.entries(fields).filter(field => {
            return field[0] !== "subject" && field[0] !== "message";
          })
        )
      ).forEach(tenant => {
        let mailOptions = {
          from: dbRes.MAIL.USER,
          to: tenant[1].email,
          subject: fields.subject,
          text: fields.message.interpolate({
            name: tenant[1].name
          }),
          attachments: []
        };
        arrayOfFiles.forEach((file, index) => {
          if (file.name.match(/^(\d*)/)[0] === tenant[0]) {
            mailOptions.attachments.push({
              path: `${file.path.substring(0, file.path.lastIndexOf("/"))}/${
                file.name
              }`
            });
          }
        });
        transporter.sendMail(mailOptions, (error, info) => {
          if (!error) {
            console.log("Email sent: " + info.response);
          } else {
            console.log(error);
          }
        });
      });
    });
  });
  res.status(200).json("Сообщения отправлены");
};

module.exports = {
  handleSend
};
