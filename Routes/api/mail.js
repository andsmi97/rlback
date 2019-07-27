const router = require('express').Router();
const email = require('../../controllers/Email');
const auth = require('../auth');

router.post('/', auth.required, email.send);
router.post('/bill', auth.required, email.sendBill);
router.post('/lastBills', auth.required, email.sendLastBills);

module.exports = router;
