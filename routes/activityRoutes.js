const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/activities', authenticateToken, activityController.createActivity);

router.get('/activitiesGET', authenticateToken, activityController.getActivities);

router.get('/activities/last', authenticateToken, activityController.getLastActivity);

module.exports = router;
