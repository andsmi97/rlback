// const apm = require('elastic-apm-node').start({
//   // Override service name from package.json
//   // Allowed characters: a-z, A-Z, 0-9, -, _, and space
//   serviceName: 'RedLakeAPMService',
//   // Set custom APM Server URL (default: http://localhost:8200)
//   serverUrl: 'http://localhost:8200',
// });

// libs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const app = express();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

//db
const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/TenantsDB';
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Middleware
app.use(bodyParser.json());
const whitelist = ['http://localhost:3000', 'https://lesnayagavan.ru'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// app.use(cors(corsOptions));
app.use(cors());
app.use(morgan('combined'));
app.use(
  morgan('common', {
    stream: fs.createWriteStream('./access.log', { flags: 'a' }),
  })
);
app.use(helmet());
app.use(express.json());
// app.use('/admin', express.static('build'));
app.use('/', express.static('ozerodom.ru'));
app.use('/news', express.static('News'));
app.use('/projects', express.static('Projects'));
app.use('/assets', express.static('assets'));
app.use(express.static(path.join(__dirname, '/build')));

// Routes
app.use(passport.initialize());
app.use(passport.session());

require('./Schemas/User');
require('./config/passport');
app.use(require('./Routes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});
// Don't stop server in production
process.on('uncaughtException', err => {
  console.log(err);
});

const server = app.listen(8080, () => {
  console.log(`Listening on port ${server.address().port}`);
});
