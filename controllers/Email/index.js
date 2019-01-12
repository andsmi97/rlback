const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const UserSettings = require('../../Schemas/UserSettings');

const recreateTenantsObject = (parsedReq) => {
  const tenants = {};
  parsedReq.forEach((pair) => {
    const num = pair[0].match(/\d+/g).join('');
    const letr = pair[0].match(/[a-zA-Z]+/g).join('');
    if (tenants[num]) {
      [, tenants[num][letr]] = pair;
    } else {
      tenants[num] = {};
      [, tenants[num][letr]] = pair;
    }
  });
  return tenants;
};

const handleSend = (req, res) => {
  // Распарсить запрос
  // const
  // Проверка данных

  // Обработать сообщение

  // Формировать сообщение

  // Отправить сообщение

  // Сохранить лог

  // Удалить файлы

  // Вернуть ответ
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFieldsSize = 50 * 1024 * 1024; // 50 MB
  form.multiples = true;
  form.on('file', (field, file) => {
    fs.rename(file.path, `${form.uploadDir}/${file.name}`, (err) => {
      if (err) throw err;
    });
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.json({
        result: 'failed',
        data: {},
        message: `Cannot upload images. Error is : ${err}`,
      });
    }
    const arrayOfFiles = [];
    Object.keys(files).forEach((file) => {
      arrayOfFiles.push(files[file]);
    });

    // Interpolate to template string
    const interpolate = (template, variables) => template.replace(/\${[^{]+}/g, (match) => {
      const path = match.slice(2, -1).trim();
      return path.split('.').reduce((res, key) => res[key], variables);
    });
    return UserSettings.findOne(
      {
        user: 'admin',
      },
      'MAIL',
      (err, dbRes) => {
        const transporter = nodemailer.createTransport({
          service: dbRes.MAIL.SERVICE,
          auth: {
            user: dbRes.MAIL.USER,
            pass: dbRes.MAIL.PASSWORD,
          },
        });
        Object.entries(
          recreateTenantsObject(
            Object.entries(fields).filter(
              field => field[0] !== 'subject' && field[0] !== 'message'
            )
          )
        ).forEach((tenant) => {
          const mailOptions = {
            from: dbRes.MAIL.USER,
            to: tenant[1].email,
            subject: fields.subject,
            text: interpolate(fields.message, {
              name: tenant[1].name,
            }),
            attachments: [],
          };
          arrayOfFiles.forEach((file) => {
            if (file.name.match(/^(\d*)/)[0] === tenant[0]) {
              mailOptions.attachments.push({
                path: `${file.path.substring(0, file.path.lastIndexOf('/'))}/${
                  file.name
                }`,
              });
            }
          });
          transporter.sendMail(mailOptions, (error, info) => {
            if (!error) {
              // TODO: log mails
              console.log(`Email sent: ${info.response}`);
            } else {
              console.log(error);
            }
          });
        });
      }
    );
  });
  res.status(200).json('Сообщения отправлены');
};

module.exports = {
  handleSend,
};
