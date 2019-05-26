const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');
const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const User = require('../Schemas/User');
const Tenant = require('../Schemas/Tenant');

const send = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFieldsSize = 100 * 1024 * 1024; // 50 MB
  form.multiples = true;
  form.on('file', (field, file) => {
    fs.rename(file.path, `${form.uploadDir}/${file.name}`, err => {
      if (err) throw err;
    });
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ errors: [{ msg: err }] });
    }

    // Interpolate to template string
    const interpolate = (template, variables) => {
      return template.replace(/\${[^{]+}/g, match => {
        const path = match.slice(2, -1).trim();
        return path.split('.').reduce((res, key) => res[key], variables);
      });
    };

    const user = await User.findOne({ user: 'admin' }, 'MAIL');
    const transporter = nodemailer.createTransport({
      service: user.MAIL.SERVICE,
      auth: {
        user: user.MAIL.USER,
        pass: user.MAIL.PASSWORD,
      },
    });

    const recieverIds = JSON.parse(fields.recievers);
    const tenants = await Tenant.find({ houseNumber: { $in: recieverIds } });
    tenants.forEach(tenant => {
      const mailOptions = {
        from: user.MAIL.USER,
        to: tenant.email,
        subject: fields.subject,
        text: interpolate(fields.message, { name: tenant.name }),
        attachments: [],
      };
      Object.values(files).forEach(file => {
        if (Number(file.name.match(/^(\d*)/)[0]) === tenant.houseNumber) {
          mailOptions.attachments.push({
            path: `${file.path.substring(
              0,
              //crossplatform path
              file.path.lastIndexOf('/') !== -1
                ? file.path.lastIndexOf('/')
                : file.path.lastIndexOf('\\')
            )}/${file.name}`,
          });
        }
        //file for multiple users
        if (!Number(file.name.match(/^(\d*)/)[0])) {
          mailOptions.attachments.push({
            path: `${file.path.substring(
              0,
              //crossplatform path
              file.path.lastIndexOf('/') !== -1
                ? file.path.lastIndexOf('/')
                : file.path.lastIndexOf('\\')
            )}/${file.name}`,
          });
        }
      });
      return transporter.sendMail(mailOptions, (error, info) => {
        if (!error) {
          // TODO: log mails
          console.log(`Email sent: ${info.response}`);
        } else {
          console.log(error);
        }
      });
    });
  });
  return res.sendStatus(204);
};

module.exports = {
  send,
};
