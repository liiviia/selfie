const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/send',authenticateToken, notificationController.sendNotification);

router.get('/getNotif',authenticateToken, notificationController.getNotificationsForUser);


// router.get('/events/last', authenticateToken, eventController.getLastEvent);

module.exports = router;
