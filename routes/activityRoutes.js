const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity'); 
const { sendReminderEmail } = require('../emailService'); 
const { route } = require('./eventRoutes');

router.post('/activities', async (req, res) => {
  try {
    const { title, description, deadline, author, email, completed } = req.body;
    
    const newActivity = new Activity({
      title,
      description,
      deadline,
      author,
      email,
      completed
    });

    const savedActivity = await newActivity.save();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (new Date(deadline).setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)) {
      sendReminderEmail(email, title, deadline); 
    }

    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Errore durante il salvataggio dell\'attività:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio dell\'attività' });
  }
});

router.get('/activitiesGET', async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }
    const activities = await Activity.find({author: username }); 
    res.status(200).json(activities); 
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero delle attività' });
  }
});


router.get('/activities/last', async (req, res) => {
  try {
    const username = req.query.username;

    if(!username) {
      return res.status(400).json({message: 'Username è necessario' }) ;
    }

    const activity = await Activity.findOne({author: username}) ;
    res.json(activity);

} catch (error) {
  console.error('errore nel recupero dell evento',error);
  res.status(500).json({ error: 'Errore nel recupero degli eventi' });
}
});

module.exports = router;
