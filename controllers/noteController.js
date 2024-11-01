const Note = require('../models/note');


exports.getAllNotes = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    // Recupera le note in base al livello di accesso
    const notes = await Note.find({
      $or: [
        { access: "public" },
        { author: username },
        { access: "restricted", allowedUsers: username }
      ]
    });

    res.json(notes);
  } catch (error) {
    console.error('Errore nel recupero delle note:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle note' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {

      return res.status(404).json({ message: 'Nota non trovata' });
    }
    res.json(note);
  } catch (error) {
    console.error('Errore nel recupero della nota:', error);
    res.status(500).json({ message: 'Errore nel recupero della nota' });
  }
};



exports.createNote = async (req, res) => {
  try {
    const { heading, author, content, completed, access, allowedUsers } = req.body;

    const newNote = new Note({
      heading,
      author,
      content,
      completed,
      access,
      allowedUsers: access === "restricted" ? allowedUsers : []
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Errore nella creazione della nota:', error);
    res.status(500).send('Errore nella creazione della nota');
  }
};

exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
    if (!updatedNote) {
      return res.status(404).send('Nota non trovata');
    }
    res.json(updatedNote);
  } catch (error) {
    console.error('Errore nell\'aggiornamento della nota:', error);
    res.status(500).send('Errore nell\'aggiornamento della nota');
  }
};



exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const result = await Note.findByIdAndDelete(noteId);

    if (!result) {
      return res.status(404).json({ message: 'Nota non trovata' });
    }

    res.json({ message: 'Nota eliminata con successo' });
  } catch (error) {
    console.error('Errore nella cancellazione della nota:', error);
    res.status(500).send('Errore nella cancellazione della nota');
  }
};


exports.getLastNote = async (req, res) => {
  try {
    const username = req.query.author;
    const lastNote = await Note.findOne({ author: username }).sort({ createdAt: -1 });
    res.json(lastNote);
  } catch (error) {
    console.error('Errore nel recupero dell\'ultima nota:', error);
    res.status(500).send('Errore nel recupero dell\'ultima nota');
  }
};


