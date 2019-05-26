const router = require('express').Router();
const tenant = require('../../controllers/Tenant');
const auth = require('../auth');

router.post('/', auth.required, tenant.validateInsert, tenant.insert);
router.patch('/', auth.required, tenant.validateUpdate, tenant.update);
router.delete('/:_id', auth.required, tenant.validateRemove, tenant.remove);
router.get('/', auth.required, tenant.select);

module.exports = router;
