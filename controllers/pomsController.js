const Pom = require('../models/pom');

// Crea una nuova sessione Pomodoro
exports.createPom = async (req, res) => {
  try {
    const { username, tempoStudio, tempoPausa, ripetizioni, giorno } = req.body;
    const newPom = new Pom({
      username,
      tempoStudio,
      tempoPausa,
      ripetizioni,
      giorno
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


exports.getLastPom = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const pom = await Pom.findOne({ username }).sort({ createdAt: -1 });
    res.status(200).json(pom);
  } catch (error) {
    console.error('Errore durante il recupero dell\'ultima sessione Pomodoro:', error);
    res.status(500).json({ error: 'Errore durante il recupero dell\'ultima sessione Pomodoro' });
  }
};

exports.getPomodorosByDate = async (req, res) => {
  try {
    const { author, date } = req.query;
    if (!author || !date) {
      return res.status(400).json({ message: 'Autore e data sono necessari' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const pomodoros = await Pomodoro.find({
      author,
      giorno: { $gte: startDate, $lte: endDate }
    });

    const formattedPomodoros = pomodoros.map(pomodoro => ({
      ...pomodoro.toObject(),
      giorno: pomodoro.giorno.toISOString()
    }));

    res.json(formattedPomodoros);
  } catch (error) {
    console.error('Errore nel recupero delle sessioni Pomodoro:', error);
    res.status(500).json({ error: 'Errore nel recupero delle sessioni Pomodoro' });
  }
};

exports.deletePom = async (req, res) => {

  try {
    const pomID = req.params.id;
    const result = await Pom.findByIdAndDelete(pomID);

    if (!result) {
      return res.status(404).json({ message: 'Pom non trovato' });
    }

    res.json({ message: 'pom eliminata con successo' });
  } catch (error) {
    console.error('Errore nella cancellazione del pomodoro:', error);
    res.status(500).send('Errore nella cancellazione del pomodoro');
  }
}

    


