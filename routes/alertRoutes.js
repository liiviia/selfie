const express = require('express');
const router = express.Router();
const { getLatestAlerts } = require('../controllers/alertController');

// Rotta per ottenere gli alert tramite polling
router.get('/get-latest-alert', getLatestAlerts);

router.get('/send-test-alert', (req, res) => {
    // Dati dell'alert di prova
    const testAlert = {
      title: 'Alert di prova',
      date: new Date(),
      startTime: new Date().toLocaleTimeString(),
      userNome: 'Test User',
    };
  
    // Aggiungi l'alert
    addAlert(testAlert.title, testAlert.date, testAlert.startTime, testAlert.userNome);
  
    res.json({ message: 'Alert di prova inviato!' });
  });

module.exports = router;
