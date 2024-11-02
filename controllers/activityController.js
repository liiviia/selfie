const Activity = require('../models/Activity');
const User = require('../models/User');
const { sendReminderEmail } = require('../services/emailService');

// Crea una nuova attività
exports.createActivity = async (req, res) => {
  try {
    const { title, description, deadline, author, email, completed, type , participants } = req.body;

    if (type === 'gruppo' && (!participants || participants.length === 0)) {
      return res.status(400).json({ error: 'Per le attività di gruppo, specifica almeno un partecipante.' });
    }
    
    const newActivity = new Activity({
      title,
      description,
      deadline,
      author,
      email,
      completed,
      type,
       participants: type === 'gruppo' ? participants : [] 
    });

    const savedActivity = await newActivity.save();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // if (new Date(deadline).setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)) {
    //   sendReminderEmail(email, title, deadline); 
    // }

    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Errore durante il salvataggio dell\'attività:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio dell\'attività' });
  }
};

// Recupera tutte le attività di un utente
exports.getActivities = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const activities = await Activity.find({
      $or: [
        { author: username },
        { participants: username }
      ]
    });

    

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero delle attività' });
  }
};

// Recupera l'ultima attività di un utente
exports.getLastActivity = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const activity = await Activity.findOne({
      $or: [
        { author: username },
        { participants: username }
      ]
    }).sort({ _id: -1 });

    res.status(200).json(activity);
  } catch (error) {
    console.error('Errore durante il recupero dell\'attività:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle attività' });
  }
};


const getUpcomingActivities = async (username) => {
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  return await Activity.find({
    $or: [
      { author: username },
      { participants: username }
    ],
    deadline: {
      $gte: today,  // maggiore o uguale a oggi
      $lte: twoDaysLater  // minore o uguale a due giorni da oggi
    }
  });
};

// attivita tra due gg

exports.getLastActivity2days = async (req, res) => {
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  try {
    const user = req.query.username;
    if (!user) {
      return res.status(400).json({ message: 'Utente non trovato' });
    }

    // Trova attività con scadenza entro i prossimi 2 giorni
    const upcomingActivities = await Activity.find({
      $or: [
        { author: user },
        { participants: user }
      ],
      deadline: {
        $gte: today,  // maggiore o uguale a oggi
        $lte: twoDaysLater  // minore o uguale a due giorni da oggi
      }
    });
 
    res.status(200).json(upcomingActivities);
  
  } catch (error) {
    console.error('Errore durante il recupero dell\'attività:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle attività' });
  }
};



// Invia l'email con le attività imminenti
exports.sendEmailWithActivities = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }


    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    const upcomingActivities = await Activity.find({
      $or: [
        { author: username, deadline: { $gte: today, $lte: twoDaysLater } },
        { participants: username, deadline: { $gte: today, $lte: twoDaysLater } } 
      ]
    });

    if (upcomingActivities.length > 0) {
      const emails = await Promise.all(upcomingActivities.map(async (activity) => {
        const participantsEmails = await User.find({ _id: { $in: activity.participants } }, 'email');
        return participantsEmails.map(participant => participant.email);
      }));


      const uniqueEmails = [...new Set(emails.flat())];


      await sendReminderEmail(uniqueEmails, upcomingActivities);
      res.status(200).json({ message: 'Email inviata con successo a tutti i partecipanti' });
    } else {
      res.status(200).json({ message: 'Nessuna attività imminente da inviare via email' });
    }

  } catch (error) {
    console.error('Errore durante invio email:', error);
    res.status(500).json({ message: 'Errore del server durante l\'invio dell\'email' });
  }
};


exports.getCurrentDayActivities = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setDate(currentDate.getDate() + 1);
    endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);


    const activities = await Activity.find({
      $or: [
        { author: username, deadline: { $gte: currentDate, $lte: endOfDay } }, 
        { participants: username, deadline: { $gte: currentDate, $lte: endOfDay } } 
      ]
    });

    if (activities.length === 0) {
      return res.status(404).json({ message: 'Nessuna attività trovata per oggi' });
    }

    res.json(activities);
  } catch (error) {
    console.error('Errore nel recupero delle attività del giorno corrente:', error);
    res.status(500).json({ error: 'Errore nel recupero delle attività del giorno corrente' });
  }
};



exports.getActivitiesByDate = async (req, res) => {
  try {
    const { author, date } = req.query;
    if (!author || !date) {
      return res.status(400).json({ message: 'Autore e data sono necessari' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);


    const activities = await Activity.find({
      $or: [
        { author, deadline: { $gte: startDate, $lte: endDate } }, 
        { participants: author, deadline: { $gte: startDate, $lte: endDate } } 
      ]
    });


    const formattedActivities = activities.map(activity => ({
      ...activity.toObject(),
      deadline: activity.deadline.toISOString()
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('Errore nel recupero delle attività:', error);
    res.status(500).json({ error: 'Errore nel recupero delle attività' });
  }
};



// Modifica la funzione di cancellazione delle attività
exports.deleteActivities = async (req, res) => {
  try {
    const activityID = req.params.id;
    const username = req.query.username; // Ottieni l'username dalla query

    // Trova l'attività
    const activity = await Activity.findById(activityID);

    if (!activity) {
      return res.status(404).json({ message: 'Attività non trovata' });
    }

    // Verifica se l'utente è l'autore dell'attività
    if (activity.author === username) {
      // L'autore può eliminare definitivamente l'attività
      await Activity.findByIdAndDelete(activityID);
      return res.json({ message: 'Attività eliminata con successo' });
    } else if (activity.participants.includes(username)) {
      // Se l'utente è solo un partecipante, rimuovilo dalla lista dei partecipanti
      activity.participants = activity.participants.filter(participant => participant !== username);
      await activity.save();
      return res.json({ message: 'Partecipazione rimossa con successo' });
    } else {
      return res.status(403).json({ message: 'Non sei autorizzato a eliminare questa attività' });
    }
  } catch (error) {
    console.error('Errore nella cancellazione della attività:', error);
    res.status(500).send('Errore nella cancellazione della attività');
  }
};
