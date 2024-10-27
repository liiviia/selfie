const Event = require('../models/Event');
const { sendNotifEmail } = require('../services/emailService');
const User = require('../models/User');


// Crea un nuovo evento
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
      recurrencePattern,
      numberOfOccurrences,
      location,
      author,
      notificationMechanism,
      notificationTime,
      repeatNotification,
    } = req.body;

    // Validazione di base
    if (!title || !date || !startTime || !author) {
      return res.status(400).json({ error: 'I campi titolo, data, ora di inizio e autore sono obbligatori.' });
    }

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
    console.error('Errore durante aggiunta evento:', error);
    res.status(500).json({ error: 'Errore durante aggiunta dell evento' });
  }
};

// Recupera tutti gli eventi di un autore
exports.getEvents = async (req, res) => {
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
};

// Recupera l'ultimo evento di un autore
exports.getLastEvent = async (req, res) => {
  try {
    const author = req.query.author;

    if (!author) {
      return res.status(400).json({ message: 'Autore è necessario' });
    }

    const event = await Event.findOne({ author }).sort({ createdAt: -1 });
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

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte

    const endOfDay = new Date(currentDate);
    endOfDay.setDate(currentDate.getDate() + 1);
    endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1); // Fine della giornata


    const events = await Event.find({
      author: username,
      date: { $gte: currentDate, $lte: endOfDay }
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
      author,
      date: { $gte: startDate, $lte: endDate }
    });

    res.json(events);
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
};

exports.deleteEvents = async (req, res) => {

  try {
    const EventID = req.params.id;
    const result = await Event.findByIdAndDelete(EventID);

    if (!result) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    res.json({ message: 'Evento eliminato con successo' });
  } catch (error) {
    console.error('Errore nella cancellazione di evento:', error);
    res.status(500).send('Errore nella cancellazione di evento');
  }
}

exports.sendEmailNotificationCreate=async(req,res) => {
  const { emailRicevente, eventDetails } = req.body;
  
  try {  
    await sendNotifEmail(emailRicevente, eventDetails);
    res.status(200).json({ message: 'Email inviata con successo' });

  } catch (error) {
    console.error('Errore durante invio della notifica email:', error);
    res.status(500).json({ error: 'Errore durante invio dell email' });
  }

}



