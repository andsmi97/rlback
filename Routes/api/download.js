const router = require('express').Router();
const download = require('../../controllers/download');
const auth = require('../auth');

router.get('/bill/:billname', download.bill);

module.exports = router;
