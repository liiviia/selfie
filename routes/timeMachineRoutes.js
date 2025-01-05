const express = require('express');
const router = express.Router();
const timeMachineController = require('../controllers/timeMachineController');

router.get('/getTime-machine', timeMachineController.getTimeMachineDate);
router.post('/updateTime-machine', timeMachineController.updateTimeMachineDate);
router.post('/time-machine/reset', timeMachineController.resetTimeMachineDate);
router.post('/activate-time-machine', timeMachineController.activateTimeMachine);
router.post('/deactivate-time-machine', timeMachineController.deactivateTimeMachine);

module.exports = router;
