const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.post('/events', async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      duration,
      isRecurring,
      frequency,
      recurrencePattern,
      numberOfOccurrences,
      location,
      author,
      notificationMechanism,
      notificationTime,
      repeatNotification,
    } = req.body;

    let notificationMechanismArray = [];

    if (Array.isArray(notificationMechanism)) {
      notificationMechanismArray = notificationMechanism; 
    } else if (typeof notificationMechanism === 'string') {
      notificationMechanismArray = notificationMechanism.split(','); 
    }

    const newEvent = new Event({
      title,
      description,
      date,
      startTime,
      duration,
      isRecurring,
      frequency,
      recurrencePattern,
      numberOfOccurrences,
      location,
      author,
      notificationMechanism: notificationMechanismArray, 
      notificationTime,
      repeatNotification,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Errore durante l\'aggiunta dell\'evento' });
  }
});

router.get('/eventsGET', async (req, res) => {
  try {
    const author = req.query.author;

    if (!author) {
      return res.status(400).json({ message: 'Autore è necessario' });
    }

    const events = await Event.find({ author });
    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
});

router.get('/events/last', async (req, res) => {
  try {
    const author = req.query.author;

    if (!author) {
      return res.status(400).json({ message: 'Autore è necessario' });
    }

    const event = await Event.findOne({ author }).sort({ createdAt: -1 }); 
    res.json(event);
  } catch (error) {
    console.error('Errore nel recupero dell\'evento', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
});

module.exports = router;
