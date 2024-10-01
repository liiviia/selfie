const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middleware/authenticateToken');

router.put('/updatePassword', authenticateToken, accountController.updatePassword);

router.delete('/deleteAccount', authenticateToken, accountController.deleteAccount);

module.exports = router;
