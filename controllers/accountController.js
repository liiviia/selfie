const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Configurazione del trasporto email
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'selfieAPP@outlook.it',
    pass: 'APPselfie2024',
  },
});

// Funzione per l'aggiornamento della password
exports.updatePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password attuale errata' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della password:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

// Funzione per eliminare l'account
exports.deleteAccount = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const mailOptions = {
      from: '"Servizio Sito SELFIE"<selfieAPP@outlook.it>',
      to: user.email,
      subject: 'Account Eliminato',
      text: 'Il tuo account è stato eliminato con successo.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
      } else {
        console.log('Email inviata: ' + info.response);
      }
    });

    res.status(200).json({ message: 'Account eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'account:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};


// Controller per ottenere tutti gli utenti
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Ritorna solo il campo username
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
};
