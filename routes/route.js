const router = require("express").Router();

const training_r = require('./c_training');
const message_r = require('./c_message');

const baseURL = process.env.BASE_URL_ROUTE
const apiVersion = process.env.API_VERSION

router.use(`${baseURL}/${apiVersion}`, training_r);
router.use(`${baseURL}/${apiVersion}`, message_r);

module.exports = router;