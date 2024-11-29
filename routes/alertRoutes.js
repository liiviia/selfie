const express = require('express');
const router = express.Router();
const { getLatestAlerts } = require('../controllers/alertController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/get-latest-alert', authenticateToken, getLatestAlerts);



module.exports = router;
