const router = require('express').Router();
const article = require('../../controllers/Article');
const auth = require('../auth');

router.post('/', auth.required, article.create);
router.delete('/:id', auth.required, article.remove);
router.patch('/:id', auth.required, article.update);
router.get('/', auth.required, article.all);
router.get('/:id', auth.required, article.one);

module.exports = router;
