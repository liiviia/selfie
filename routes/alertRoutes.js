const express = require('express');
const router = express.Router();
const { getLatestAlerts } = require('../controllers/alertController');

router.get('/get-latest-alert', getLatestAlerts);



module.exports = router;
