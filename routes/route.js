const router = require("express").Router();

const training_r = require('./c_training');
const message_r = require('./c_message');

router.use("/api/v1", training_r);
router.use("/api/v1", message_r);

module.exports = router;