const Event = require('../models/Event');
const { sendNotifEmail } = require('../services/emailService');
const User = require('../models/User');
const { getTimeMachineDate } = require('../controllers/timeMachineController');
const ICAL = require('ical.js');

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      duration,
      isRecurring,
      frequency,
      email,
      numberOfOccurrences,
      location,
      author,
      notificationMechanism,
      notificationTime,
      repeatNotification,
      participants,
      type,
    } = req.body;
    console.log(req.body);

    if (!title || !date || !startTime || !author) {
      return res.status(400).json({ error: 'I campi titolo, data, ora di inizio e autore sono obbligatori.' });
    }

    let notificationMechanismArray = [];

    if (Array.isArray(notificationMechanism)) {
      notificationMechanismArray = notificationMechanism;
    } else if (typeof notificationMechanism === 'string') {
      notificationMechanismArray = notificationMechanism.split(',');
    }

    console.log("NotificationMechanismArray", notificationMechanismArray);

    const createAndSaveEvent = async (eventDate) => {
      const newEvent = new Event({
        title,
        description,
        date: eventDate,
        startTime,
        duration,
        isRecurring,
        frequency,
        email,
        numberOfOccurrences,
        location,
        author,
        notificationMechanism: notificationMechanismArray,
        notificationTime,
        repeatNotification,
        participants: type === 'gruppo' ? participants : [],
        type,
      });

      const savedEvent = await newEvent.save();
      //console.log(savedEvent);
      return savedEvent;
    };

    if (isRecurring) {
      const events = [];

      let occurrences = numberOfOccurrences;
      const startDate = new Date(date);

      switch (frequency) {
        case 'daily':
          for (let i = 0; i < occurrences; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i);

            const savedEvent = await createAndSaveEvent(newDate.toISOString());
            events.push(savedEvent);
          }
          break;

        case 'weekly':
          for (let i = 0; i < occurrences; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i * 7);

            const savedEvent = await createAndSaveEvent(newDate.toISOString());
            events.push(savedEvent);
          }
          break;

        case 'monthly':
          for (let i = 0; i < occurrences; i++) {
            const newDate = new Date(startDate);
            newDate.setMonth(startDate.getMonth() + i);

            const savedEvent = await createAndSaveEvent(newDate.toISOString());
            events.push(savedEvent);
          }
          break;

        default:
          return res.status(400).json({ error: 'Frequenza non supportata' });
      }

      res.status(201).json(events);
    } else {
      const newEvent = new Event({
        title,
        description,
        date,
        startTime,
        duration,
        isRecurring,
        frequency,
        email,
        numberOfOccurrences,
        location,
        author,
        notificationMechanism: notificationMechanismArray,
        notificationTime,
        repeatNotification,
        participants: type === 'gruppo' ? participants : [],
        type,
      });

      const savedEvent = await newEvent.save();
      console.log("Evento salvato:", savedEvent);
      res.status(201).json(savedEvent);
    }

  } catch (error) {
    console.error('Errore durante aggiunta evento:', error);
    res.status(500).json({ error: 'Errore durante aggiunta dell\'evento' });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const author = req.query.author;

    if (!author) {
      return res.status(400).json({ message: 'Autore è necessario' });
    }

    const events = await Event.find({
      $or: [
        { author: author },
        { participants: author }
      ]
    });
    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
};

exports.getLastEvent = async (req, res) => {
  try {
    const author = req.query.author;

    if (!author) {
      return res.status(400).json({ message: 'Autore è necessario' });
    }

    const event = await Event.findOne({

      $or: [
        { author: author },
        { participants: author }
      ]
    }).sort({ _id: -1 });


    res.status(200).json(event);
  } catch (error) {
    console.error('Errore nel recupero dell\'evento:', error);
    res.status(500).json({ error: 'Errore nel recupero dell\'evento' });
  }
};



exports.getCurrentDayEvents = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const timeMachineDate = await getTimeMachineDate();
    const currentDate = new Date(timeMachineDate);
    currentDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setDate(currentDate.getDate() + 1);
    endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

    const events = await Event.find({
      $or: [
        { author: username, date: { $gte: currentDate, $lte: endOfDay } },
        { participants: username, date: { $gte: currentDate, $lte: endOfDay } }
      ]
    });

    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi del giorno corrente:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi del giorno corrente' });
  }
};




exports.getEventByDate = async (req, res) => {
  try {
    const { author, date } = req.query;
    if (!author || !date) {
      return res.status(400).json({ message: 'Autore e data sono necessari' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const events = await Event.find({
      $or: [
        { author, date: { $gte: startDate, $lte: endDate } },
        { participants: author, date: { $gte: startDate, $lte: endDate } },
      ],
    });

    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
};

exports.deleteEvents = async (req, res) => {
  try {
    const eventID = req.params.id;
    const username = req.query.username;

    const event = await Event.findById(eventID);

    if (!event) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    if (event.author === username) {
      await Event.findByIdAndDelete(eventID);
      return res.json({ message: 'Evento eliminato con successo' });
    } else {
      event.participants = event.participants.filter(
        (participant) => participant !== username
      );
      await event.save();
      return res.json({ message: 'Utente rimosso dai partecipanti' });
    }
  } catch (error) {
    console.error('Errore nella cancellazione di evento:', error);
    res.status(500).send('Errore nella cancellazione di evento');
  }
};


exports.sendEmailNotificationCreate = async (req, res) => {
  const { emailRicevente, eventDetails } = req.body;

  try {
    await sendNotifEmail(emailRicevente, eventDetails);
    res.status(200).json({ message: 'Email inviata con successo' });

  } catch (error) {
    console.error('Errore durante invio della notifica email:', error);
    res.status(500).json({ error: 'Errore durante invio dell email' });
  }

};

exports.nonDisponibile = async (req, res) => {
  try {
    const { startHour, startMinute, endHour, endMinute, repeatDaily, giorno } = req.body;
    console.log("dati non disp", req.body);
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    user.unavailableTimes.push({
      startHour,
      startMinute,
      endHour,
      endMinute,
      repeatDaily,
      giorno
    });

    await user.save();

    res.status(200).json({ message: 'Indisponibilità aggiunta con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

exports.nonDisponibileGET = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    return res.status(200).json(user.unavailableTimes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
};

exports.rimNonDisponibile = async (req, res) => {
  console.log("aico0");
  try {
    const username = req.query.username;
    const id = req.query.id;
    console.log("us:", username, "id", id);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const unavailableTimeIndex = user.unavailableTimes.findIndex(time => time.id === id);

    if (unavailableTimeIndex === -1) {
      return res.status(404).json({ message: 'Tempo non disponibile non trovato' });
    }

    user.unavailableTimes.splice(unavailableTimeIndex, 1);

    await user.save();

    return res.status(200).json({ message: 'Tempo non disponibile eliminato con successo' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
};





function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = (end - start) / (1000 * 60); // durata in minuti
  return duration;
}


