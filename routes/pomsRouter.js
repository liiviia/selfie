const express = require('express');
const router = express.Router();
const pomController = require('../controllers/pomsController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/pomsPOST', authenticateToken, pomController.createPom);

router.get('/poms', authenticateToken, pomController.getPoms);

router.get('/poms/last', authenticateToken, pomController.getLastPom);


module.exports = router;
