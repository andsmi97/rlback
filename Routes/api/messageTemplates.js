const router = require('express').Router();
const messageTemplate = require('../../controllers/MessageTemplate');
const auth = require('../auth');

router.post('/', auth.required, messageTemplate.create);
router.delete('/:id', auth.required, messageTemplate.remove);
router.patch('/:id', auth.required, messageTemplate.update);
router.get('/', auth.required, messageTemplate.all);
router.get('/:id', auth.required, messageTemplate.one);

module.exports = router;
