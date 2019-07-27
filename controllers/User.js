const passport = require('passport');
const User = require('../Schemas/User');

const getEmailService = email => email.match(/(?<=@)[^.]+(?=\.)/g).join('');

const isCorrectEmail = email => {
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.payload.id);
    if (user.validatePassword(currentPassword)) {
      user.setPassword(newPassword);
      await user.save();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(400).json('Неправильный пароль');
    }
  } catch (e) {
    return res.status(403);
  }
};

const updateCredentials = async (req, res) => {
  const { email, password, phone, phone2 } = req.body;
  console.log(email);
  try {
    console.log(isCorrectEmail(email));
    if (isCorrectEmail(email)) {
      await User.findOneAndUpdate(
        { _id: req.payload.id },
        {
          $set: {
            phone,
            phone2,
            MAIL: {
              USER: email,
              PASSWORD: password,
              SERVICE: getEmailService(email),
            },
          },
        }
      );
      res.sendStatus(204);
    } else {
      return res.status(400).json('Введен неправильный Email');
    }
  } catch (e) {
    return res.sendStatus(403);
  }
};

const getCredentials = async (req, res) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) {
      return res.sendStatus(401);
    }
    return res.json({
      user: {
        ...user.toAuthJSON(),
        phone: user.phone,
        phone2: user.phone2,
        emailAccount: user.MAIL.USER,
        isInitialValuesSet: user.isInitialValuesSet,
      },
    });
  } catch (e) {
    return res.sendStaus(403);
  }
};
const register = async (req, res) => {
  const { username, email, password, phone, MAIL } = req.body.user;
  const user = new User({ username, email, phone, MAIL });
  user.setPassword(password);
  try {
    await user.save();
    return res.status(200).json({ user: user.toAuthJSON() });
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body.user;
  if (!email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }
  if (!password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
};

//TODO: change to multy user request
const getContacts = async (req, res) => {
  try {
    const user = await User.findOne(
      { email: 'admin' },
      {
        _id: 0,
        phone: 1,
        'MAIL.USER': 1,
        phone2: 1,
      }
    );
    return res.status(200).json(user);
  } catch (e) {
    return res.sendStaus(403);
  }
};

module.exports = {
  login,
  register,
  getContacts,
  getCredentials,
  updatePassword,
  updateCredentials,
};
