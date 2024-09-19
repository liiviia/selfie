const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

// Registrazione utente
router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Controlla se l'username esiste già
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Nome utente già esistente' });
    }

    // Cifra la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuovo utente
    const newUser = new User({
      name,
      username,
      password: hashedPassword
    });

    // Salva l'utente
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
  }
});

module.exports = router;
