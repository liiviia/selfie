const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true }, // durata in minuti
  repeatFrequency: { type: String }, // es.: 'daily', 'weekly', 'monthly', 'custom'
  daysOfWeek: [String], // es.: ['monday', 'wednesday']
  dayOfMonth: { type: Number }, // es.: 4 (per il giorno del mese)
  repeatCount: { type: Number }, // numero di ripetizioni
  repeatUntil: { type: Date }, // data finale per la ripetizione
  location: { type: String }, // luogo fisico o virtuale
  author: { type: String, required: true },
  notificationMechanism: [String], // es.: ['OS', 'Email']
  notificationAdvanceMinutes: { type: Number },
  notificationAdvanceHours: { type: Number },
  notificationAdvanceDays: { type: Number },
  notificationRepeat: { type: String } // es.: 'everyMinute', 'everyHour', 'untilResponse'
});

module.exports = mongoose.model('Event', eventSchema);