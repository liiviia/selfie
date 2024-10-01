const Activity = require('../models/Activity');
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

    if (new Date(deadline).setHours(0, 0, 0, 0) === tomorrow.setHours(0, 0, 0, 0)) {
      sendReminderEmail(email, title, deadline); 
    }

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
