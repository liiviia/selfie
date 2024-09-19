const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/notesGET', noteController.getAllNotes);
router.get('/nota/:id', noteController.getNoteById);



router.post('/notes',noteController.createNote);

router.put('/notes/:id', noteController.updateNote);

router.delete('/notesRIM/:id', noteController.deleteNote);



module.exports = router;
