const express = require('express');
const router = express.Router();
const Pom = require('../models/pom'); 

router.post('/pomsPOST', async (req, res) => {
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
