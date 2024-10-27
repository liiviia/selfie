
const nodemailer = require('nodemailer');
require('dotenv').config(); //per variabili d'ambiente

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appp4905@gmail.com',
    pass: process.env.PASS_MAIL,
  },
});



//inivio la mail
const sendMail=(mailOptions)=>{
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell invio email:', error);
    } else {
      console.log('Email inviata:', info.response);
    }
  });
};


//mail per attività in scadenza nei prossimi 2 giorni
const sendReminderEmail = (email, activities) => {

  let emailContent = 'Ciao! Ecco le attività in scadenza nei prossimi 2 giorni:\n\n';

  activities.forEach(activity => {
    emailContent += `- ${activity.title} (scadenza: ${activity.deadline.toLocaleDateString()})\n`;
  });

  const mailOptions = {
    from: '"Servizio Sito SELFIE"<appp4905@gmail.com>',
    to: email,
    subject: 'Promemoria: Attività in scadenza tra 2gg',
    text: emailContent,
  };
  sendMail(mailOptions);
};


//mail per evento notifica in creazione
const sendNotifEmail = (recipientEmail, eventDetails) => {
  const mailOptions = {
    from: '"Servizio Sito SELFIE"<appp4905@gmail.com>',
    to: recipientEmail,
    subject: 'Evento: Evento creato',
    html: `
       <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #2c3e50;">L'evento "${eventDetails.title}" è stato creato !</h2>
        <p style="font-size: 16px;">
          <strong>📅 Data:</strong> ${eventDetails.date}<br>
          <strong>🕒 Ora di inizio:</strong> ${eventDetails.startTime}<br>
          <strong>📍 Luogo:</strong> ${eventDetails.location}<br>
          <strong>⏳ Durata:</strong> ${eventDetails.duration} minuti
          <p style="font-size: 14px;">Non mancare! Preparati per l'evento.</p>
        <p style="font-size: 14px;">Grazie,<br>Il Team SELFIE</p>
        </p>        
      </div>
    `
  };
  sendMail(mailOptions);
} ;



module.exports = { sendReminderEmail, sendNotifEmail };

