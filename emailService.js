
const nodemailer = require('nodemailer');
require('dotenv').config(); //per variabili d'ambiente

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appp4905@gmail.com',
    pass: process.env.PASS_MAIL,
  },
});
  

const sendReminderEmail = (email, activities) => {

  let emailContent = 'Ciao! Ecco le attività in scadenza nei prossimi 2 giorni:\n\n';

  activities.forEach(activity => {
    emailContent += `- ${activity.title} (scadenza: ${activity.deadline.toLocaleDateString()})\n`;
  });

  const mailOptions = {
      from: '"Servizio Sito SELFIE"<appp4905@gmail.com>',
      to: email,
      subject: 'Promemoria: Attività in scadenza',
      text: emailContent,
  };
  
  //inivio la mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell invio email:', error);
    } else {
      console.log('Email inviata:', info.response);
    }
  });
};


module.exports = { sendReminderEmail };

