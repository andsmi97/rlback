const jwt = require('jsonwebtoken');
const redis = require('redis');
const mongoose = require('mongoose');
const UserSettings = require('../../Schemas/UserSettings');

const connectionString = 'mongodb://localhost:27017/TenantsDB';
// You will want to update your host to the proper address in production
const redisClient = redis.createClient(process.env.REDIS_URI);
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '50 days' });
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
  const { username, id } = user;
  const token = signToken(username);
  return setToken(token, id)
    .then(() => ({
      success: 'true',
      userId: id,
      token,
      user,
    }))
    .catch(err => console.log(err));
};

const handleSignin = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return Promise.reject('Введены недопустимые данные');
  }
  return UserSettings.findOne({ user: username, password }, 'password')
    .then((data) => {
      if (data !== null) {
        return Promise.resolve(data);
        // return res.status(200).json(dbRes._id);
      }
      return Promise.reject('Неправильные данные');
    })
    .catch(err => err);
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized');
    }
    return res.json({
      success: 'true',
      token: authorization,
    });
  });
};

const signinAuthentication = (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(req, res)
      .then(data => (data._id ? createSession(data) : Promise.reject(data)))
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
};

module.exports = {
  signinAuthentication,
  redisClient,
};
