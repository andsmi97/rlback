const router = require('express').Router();
const sensors = require('../../controllers/SensorData');
const auth = require('../auth');

router.post('/all', auth.required, sensors.insertAll);
router.post('/setInitialValues', auth.required, sensors.setInitialValues);

module.exports = router;
