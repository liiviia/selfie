// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
//const notificationService = require('../services/NotificationService');

//manda notifica ad un utente
exports.sendNotification = async (req, res) => {
    const { recipientId, message } = req.body;
    if (!recipientId || !message) return res.status(400).json({ message: 'userId e message sono necessari' });

    try {
        // Crea una nuova notifica
        const notification = new Notification({
            recipient: recipientId, // Usa l'ID dell'utente qui
            message: message
        });

        await notification.save();
        res.status(200).json({ message: 'Notifica inviata con successo' });
    } catch (error) {
        console.error('Errore durante l\'invio della notifica:', error);
        res.status(500).json({ message: 'Errore durante l\'invio della notifica' });
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
  