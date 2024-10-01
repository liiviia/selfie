const Pom = require('../models/pom');

// Crea una nuova sessione Pomodoro
exports.createPom = async (req, res) => {
  try {
    const { username, tempoStudio, tempoPausa, ripetizioni } = req.body;
    const newPom = new Pom({
      username,
      tempoStudio,
      tempoPausa,
      ripetizioni
    });

    const savedPom = await newPom.save();
    res.status(201).json(savedPom);
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
    res.status(500).json({ error: error.message });
  }
};

// Recupera tutte le sessioni Pomodoro di un utente
exports.getPoms = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const poms = await Pom.find({ username });
    res.status(200).json(poms);
  } catch (error) {
    console.error('Errore durante il recupero delle sessioni Pomodoro:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle sessioni Pomodoro' });
  }
};
