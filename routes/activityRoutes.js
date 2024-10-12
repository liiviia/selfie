const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/activities', authenticateToken, activityController.createActivity);

router.get('/activitiesGET', authenticateToken, activityController.getActivities);

router.get('/activities/last', authenticateToken, activityController.getLastActivity);

router.get('/activities/2days', authenticateToken, activityController.getLastActivity2days);

router.post('/activities/sendEmail', authenticateToken, activityController.sendEmailWithActivities);


module.exports = router;
