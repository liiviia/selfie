const express = require('express');
const router = express.Router();
const pomController = require('../controllers/pomsController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/pomsPOST', authenticateToken, pomController.createPom);

router.get('/poms', authenticateToken, pomController.getPoms);

router.get('/poms/last', authenticateToken, pomController.getLastPom);

router.get('/poms/by-date', authenticateToken, pomController.getPomodorosByDate);

router.delete('/pomRemove/:id', authenticateToken, pomController.deletePom) ;



module.exports = router;
