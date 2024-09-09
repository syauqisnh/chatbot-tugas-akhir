const router = require('express').Router();

const {
    put_message,
    delete_message,
    get_all_message,
    get_detail_message,
} = require('../controllers/c_message')

router.put('/message/:message_uuid', put_message)
router.delete('/message/:message_uuid', delete_message)
router.get('/message/get_all', get_all_message)
router.get('/message/:message_uuid', get_detail_message)

module.exports = router;