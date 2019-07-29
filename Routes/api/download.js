const router = require('express').Router();
const download = require('../../controllers/Download');
const auth = require('../auth');

router.get('/bill/:billname', download.bill);

module.exports = router;
