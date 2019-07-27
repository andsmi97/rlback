const router = require('express').Router();
const sensors = require('../../controllers/SensorData');
const auth = require('../auth');

router.post('/bill', auth.required, sensors.insert); //
router.delete('/bill/:billId', auth.required, sensors.remove);
router.put('/bill/:billId', auth.required, sensors.update);
router.get('/lastBills', auth.required, sensors.getLast); //
router.get('/lastBillDate', auth.required, sensors.getLastBillDate); //
router.delete('/lastBills', auth.required, sensors.removeLastBills); //

module.exports = router;
