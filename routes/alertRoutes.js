const express = require('express');
const router = express.Router();
const { getLatestAlerts , addAlert} = require('../controllers/alertController');

// Rotta per ottenere gli alert tramite polling
router.get('/get-latest-alert', getLatestAlerts);

router.get('/send-test-alert', (req, res) => {
    const testAlert = {
      title: 'Alert di prova',
      date: new Date(),
      startTime: new Date().toLocaleTimeString(),
      userNome: 'Test User',
    };
  
    console.log("Alert di prova inviato:", testAlert);
    addAlert(testAlert.title, testAlert.date, testAlert.startTime, testAlert.userNome);
  
    res.json({ alerts: alerts });  // Rispondi con gli alert    
    // Assicurati che questa sia una risposta JSON corretta
  });

module.exports = router;
