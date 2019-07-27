const router = require('express').Router();
const content = require('../../controllers/Content');
const auth = require('../auth');

router.post('/', auth.required, content.addPhoto);
router.delete('/', auth.required, content.deletePhoto);
router.put('/', auth.required, content.updatePhoto);
router.put('/salesText', auth.required, content.changeSalesText);
router.get('/', auth.optional, content.siteContent);
router.patch('/reorder', auth.required, content.reorderPhotos);

//hardcoded content for deployment
router.post('/default', auth.required, content.addDefaultPhotos);
router.delete('/clear', auth.required, content.clearAll);

module.exports = router;
