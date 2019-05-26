const router = require('express').Router();
const email = require('../../controllers/Email');

router.post('/', email.send);

module.exports = router;
