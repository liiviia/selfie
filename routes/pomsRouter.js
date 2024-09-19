const express = require('express');
const router = express.Router();
const Pom = require('../models/pom'); 

router.post('/poms', async (req, res) => {
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
    res.status(500).json({ error: 'Errore durante il salvataggio della sessione pomodoro' });
  }
});


router.get('/poms', async (req, res) => {
    try {
      const poms = await Pom.find();
      res.status(200).json(poms);
    } catch (error) {
      res.status(500).json({ error: 'Errore durante il recupero delle sessioni Pomodoro' });
    }
  });



module.exports = router;
