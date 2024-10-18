// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
//const notificationService = require('../services/NotificationService');

//manda notifica ad un utente
exports.sendNotification = async (req, res) => {
   const { recipients, message } = req.body;

  if (!recipients || recipients.length === 0 || !message) {
    return res.status(400).json({ message: 'I destinatari e il messaggio sono necessari' });
  }

  try {
    // Invia la notifica a ciascun destinatario selezionato
    for (const recipientId of recipients) {
      const user = await User.findById(recipientId);

      if (!user) {
        return res.status(404).json({ message: `Utente con ID ${recipientId} non trovato` });
      }

      const notification = new Notification({
        recipient: user._id,
        message: message,
        isRead: false,
        createdAt: new Date()
      });

      await notification.save();
    }

    res.status(200).json({ message: 'Notifiche inviate con successo' });
  } catch (error) {
    console.error('Errore durante l\'invio delle notifiche:', error);
    res.status(500).json({ message: 'Errore durante l\'invio delle notifiche' });
  }
};

//notifiche dell utente
exports.getNotificationsForUser = async (req, res) => {
    const userId = req.user.id; // Supponendo che tu stia usando middleware per autenticare l'utente e impostare req.user
    if (!userId) {return res.status(400).json({ message: 'userId mancante' }); }

    try {
        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 }); // Recupera le notifiche per l'utente loggato, ordinate per data
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Errore durante il recupero delle notifiche:', error);
        res.status(500).json({ message: 'Errore durante il recupero delle notifiche' });
    }
};
  
//elimina una notifica con id
exports.deleteNotification = async (req, res) => {
    const { id } = req.params; // id della notifica dai parametri della richiesta
  
    try {
      const notification = await Notification.findByIdAndDelete(id);
  
      if (!notification) {
        return res.status(404).json({ message: 'notifica non trovata.' });
      }
  
      res.status(200).json({ message: 'notifica eliminata con successo' });
    } catch (error) {
      console.error('errore durante eliminazione della notifica: ', error);
      res.status(500).json({ message: 'errore del server' });
    }
  };