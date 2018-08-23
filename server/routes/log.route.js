var express = require('express');
var router = express.Router();

var logController = require('../controllers/log.ctrl');

router.post('/', logController.log)

module.exports = router;