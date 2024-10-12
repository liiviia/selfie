const Activity = require('../models/Activity');
const User = require('../models/User');
const { sendReminderEmail } = require('../emailService');

// Crea una nuova attività
exports.createActivity = async (req, res) => {
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

    const activities = await Activity.find({ author: username });
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

    const activity = await Activity.findOne({ author: username }).sort({ _id: -1 }); 
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
    author: username,
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
      author:user,
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

    // Recupera l'utente
    const user = await User.findOne({ username:username });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Recupera le attività imminenti (entro 2 giorni)
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    const upcomingActivities = await Activity.find({
      author: username,
      deadline: {
        $gte: today,
        $lte: twoDaysLater
      }
    });

    if (upcomingActivities.length > 0) {
      // Invia l'email di promemoria
      await sendReminderEmail(user.email, upcomingActivities);
      res.status(200).json({ message: 'Email inviata con successo' });
    } else {
      res.status(200).json({ message: 'Nessuna attività imminente da inviare via email' });
    }

  } catch (error) {
    console.error('Errore durante invio email:', error);
    res.status(500).json({ message: 'Errore del server durante l invio dell email' });
  }
};
