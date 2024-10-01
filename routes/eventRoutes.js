const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/events', authenticateToken, eventController.createEvent);

router.get('/eventsGET', authenticateToken, eventController.getEvents);

router.get('/events/last', authenticateToken, eventController.getLastEvent);

module.exports = router;
