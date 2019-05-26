// libs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const app = express();
require('dotenv').config();
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
app.use(helmet());
app.use(express.json());
app.use('/admin', express.static('build'));
app.use('/', express.static('ozerodom.ru'));
app.use('/news', express.static('News'));
app.use('/projects', express.static('Projects'));
app.use('/assets', express.static('assets'));
// Routes
app.use(passport.initialize());
app.use(passport.session());

require('./Schemas/User');
require('./config/passport');
app.use(require('./Routes'));

// Don't stop server in production
process.on('uncaughtException', err => {
  console.log(err);
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${server.address().port}`);
});
