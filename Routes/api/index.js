const router = require('express').Router();

router.use('/users', require('./user'));
router.use('/tenants', require('./tenants'));
router.use('/mail', require('./mail'));
router.use('/articles', require('./articles'));
router.use('/content', require('./content'));
router.use('/images', require('./images'));

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {}),
    });
  }
  return next(err);
});

module.exports = router;
