const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Riferimento all'utente che riceve la notifica
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },    //letto: si no
  createdAt: { type: Date, default: Date.now }, //data creazione
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
