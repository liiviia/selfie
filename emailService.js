
const nodemailer = require('nodemailer');


  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, 
    auth: {
      user: 'selfieAPP@outlook.it',
      pass: 'APPselfie2024',
    },
  });
  
  
  

  const sendReminderEmail = (email, activityTitle, deadline) => {
    const mailOptions = {
        from: '"Servizio Sito SELFIE"<selfieAPP@outlook.it>',
        to: email,
      subject: 'Promemoria: Attività in scadenza',
      text: `Ciao! Ricorda che l'attività "${activityTitle}" scade il ${deadline}.`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Errore nell\'invio dell\'email:', error);
      } else {
        console.log('Email inviata:', info.response);
      }
    });
  };


  module.exports = { sendReminderEmail };

