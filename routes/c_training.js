const router = require('express').Router();

const {
    post_training,
    post_training_admin,
    put_training,
    delete_training,
    get_all_training,
    get_detail_training,
} = require('../controllers/c_training')

router.post('/training', post_training)
router.post('/training_admin', post_training_admin)
router.put('/training/:training_uuid', put_training)
router.delete('/training/:training_uuid', delete_training)
router.get('/training/get_all', get_all_training)
router.get('/training/:training_uuid', get_detail_training)

module.exports = router;