const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

async function sendConfirmationEmail(email, username) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, 
    auth: {
      user: 'selfieAPP@outlook.it',
      pass: 'APPselfie2024',
    },
  });

  let mailOptions = {
    from: '"Servizio Sito SELFIE"<selfieAPP@outlook.it>',
    to: email,
    subject: 'Conferma registrazione',
    text: `Ciao ${username}, grazie per esserti registrato sul nostro sito!`,
    html: `<h1>Benvenuto, ${username}!</h1><p>Grazie per esserti registrato.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email di conferma inviata a:', email);
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
  }
}

exports.register = async (req, res) => {
  try {
    const { username, password, email, phoneNumber } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Nome utente già esistente' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email già esistente' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phoneNumber
    });

    const savedUser = await newUser.save();

    //await sendConfirmationEmail(email, username);

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
  }
};




