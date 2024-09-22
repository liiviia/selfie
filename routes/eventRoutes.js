const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.post('/events', async (req, res) => {
  const {
    title, description, date, time, duration, repeatFrequency, daysOfWeek,
    dayOfMonth, repeatCount, repeatUntil, location, author,
    notificationMechanism, notificationAdvanceMinutes,
    notificationAdvanceHours, notificationAdvanceDays, notificationRepeat
  } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      duration,
      repeatFrequency,
      daysOfWeek: daysOfWeek ? daysOfWeek.split(',') : [],
      dayOfMonth,
      repeatCount,
      repeatUntil,
      location,
      author,
      notificationMechanism: notificationMechanism ? notificationMechanism.split(',') : [],
      notificationAdvanceMinutes,
      notificationAdvanceHours,
      notificationAdvanceDays,
      notificationRepeat
    });

    const savedEvent = await newEvent.save(); 
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante l\'aggiunta dell\'evento' });
  }
});



router.get('/eventsGET', async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const events = await Event.find({author: username }); 
    res.json(events); 
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
});


router.get('/events/last', async (req, res) => {

  try {
      const username = req.query.username;

      if(!username) {
        return res.status(400).json({message: 'Username è necessario' }) ;
      }

      const event = await Event.findOne({author: username}) ;
      res.json(event);

  } catch (error) {
    console.error('errore nel recupero dell evento',error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
});





module.exports = router;





