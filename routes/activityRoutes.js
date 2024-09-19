const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity'); 


router.post('/activities', async (req, res) => {
  try {
    const { title, description, deadline, author, completed } = req.body;
    
    const newActivity = new Activity({
      title,
      description,
      deadline,
      author,
      completed
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Errore durante il salvataggio dell\'attività:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio dell\'attività' });
  }
});


router.get('/activities', async (req, res) => {
    try {
      const activities = await Activity.find(); // Recupera tutte le attività dal database
      res.status(200).json(activities); // Restituisce le attività come JSON
    } catch (error) {
      res.status(500).json({ error: 'Errore durante il recupero delle attività' });
    }
  });


  

module.exports = router;
