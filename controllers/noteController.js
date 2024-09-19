const Note = require('../models/note');


exports.getAllNotes = async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username è necessario' });
    }

    console.log('Richiesta note per l\'utente:', username); 

    const notes = await Note.find({ author: username });

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
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
    const { heading, author, completed } = req.body;

    const newNote = new Note({
      heading,
      author,
      completed
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).send('Error creating note');
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
