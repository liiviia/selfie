const express = require('express');
const router = require('./routes/authRoutes');
const app = express();

let alertQueue = []; 

app.get('/alerts', (req, res) => {
  const userNome = req.query.userNome; 

  const userAlerts = alertQueue.filter((alert) => alert.userNome === userNome);

  alertQueue = alertQueue.filter((alert) => alert.userNome !== userNome);

  res.json(userAlerts);
});

const sendAlertNotification = (title, date, startTime, userNome) => {
  alertQueue.push({
    title,
    date,
    startTime,
    userNome,
  });
  console.log(`Notifica aggiunta per ${userNome}:`, title);
};


module.exports = {
  app,
  sendAlertNotification,
};
