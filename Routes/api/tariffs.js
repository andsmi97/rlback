const router = require('express').Router();
const tariffs = require('../../controllers/Tariffs');
const auth = require('../auth');

router.get('/', auth.required, tariffs.selectLast);
router.post('/', auth.required, tariffs.validateInsert, tariffs.insert);
router.get('/all', auth.required, tariffs.selectAll);

module.exports = router;
