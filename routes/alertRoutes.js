const express = require('express');
const router = express.Router();
const { getLatestAlerts } = require('../controllers/alertController');

// Rotta per ottenere gli alert tramite polling
router.get('/get-latest-alert', getLatestAlerts);

module.exports = router;
