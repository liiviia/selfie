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



exports.getEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Errore durante il recupero degli eventi', error });
    }
  };

module.exports = router;
