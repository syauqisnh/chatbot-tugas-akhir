const router = require('express').Router();

const {
    put_chatbot,
    delete_chatbot,
    get_all_chatbot,
    get_detail_chatbot,
} = require('../controllers/c_chatbot')

router.put('/chatbot/:chatbot_uuid', put_chatbot)
router.delete('/chatbot/:chatbot_uuid', delete_chatbot)
router.get('/chatbot/get_all', get_all_chatbot)
router.get('/chatbot/:chatbot_uuid', get_detail_chatbot)

module.exports = router;