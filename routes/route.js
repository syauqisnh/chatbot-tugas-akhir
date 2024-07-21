const router = require("express").Router();

const training_r = require('./c_training');
const chatbot_r = require('./c_chatbot');

router.use("/api/v1", training_r);
router.use("/api/v1", chatbot_r);

module.exports = router;