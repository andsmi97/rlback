const router = require('express').Router();
const images = require('../../controllers/Images');
const auth = require('../auth');

router.post('/', auth.required, images.upload);

module.exports = router;
