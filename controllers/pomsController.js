const Pom = require('../models/pom');

// Crea una nuova sessione Pomodoro
exports.createPom = async (req, res) => {
  try {
    const { username, tempoStudio, tempoPausa, ripetizioni, giorno, cicliRimanenti, remainingTime, isStudyPhase, studyCycles } = req.body;
    const newPom = new Pom({
      username,
      tempoStudio,
      tempoPausa,
      ripetizioni,
      giorno, 
      cicliRimanenti, 
      remainingTime, 
      isStudyPhase, 
      studyCycles
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
    const { username, date } = req.query;
    if (!username || !date) {
      return res.status(400).json({ message: 'Autore e data sono necessari' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const pomodoros = await Pom.find({
      username,
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

// Salva Pomodoro incompleta
exports.saveUncompletedPom = async (req, res) => {
  try {
    const { username, giorno, remainingTime, isStudyPhase, studyCycles } = req.body;

    if (!giorno) {
      return res.status(400).json({ error: "Il campo 'giorno' è obbligatorio e non può essere nullo." });
    }

    const startDate = new Date(giorno);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(giorno);
    endDate.setHours(23, 59, 59, 999);

    let pomodoro = await Pom.findOneAndUpdate(
      { username, giorno: { $gte: startDate, $lte: endDate } },
      { remainingTime, isStudyPhase, studyCycles, giorno: new Date(giorno) },
      { new: true, upsert: true }
    );
   
    res.status(200).json({ message: 'Sessione incompleta salvata', pomodoro });
  } catch (error) {
    console.error('Errore nel salvataggio della sessione incompleta:', error);
    res.status(500).json({ error: 'Errore nel salvataggio della sessione incompleta' });
  }
};

// Recupera Pomodoro incompleta
exports.getUncompletedPomodoros = async (req, res) => {
  
  try {
    const username = req.query.username.trim();
    console.log("Username ricevuto:", username);
    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    const pomodoro = await Pom.findOne({ username, remainingTime: { $gt: 0 } }).sort({ updatedAt: -1 });
    
    if (pomodoro) {
      res.status(200).json(pomodoro);
    } else {
      res.status(404).json({ message: 'Nessuna sessione incompleta trovata' });
    }
  } catch (error) {
    console.error('Errore nel recupero delle sessioni incompleta:', error);
    res.status(500).json({ error: 'Errore nel recupero delle sessioni incompleta' });
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

    


