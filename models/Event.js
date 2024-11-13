const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Formato: "HH:mm"
    required: true,
  },
  duration: {
    type: Number, // Durata in minuti
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom', 'one-time'],
    default: 'one-time',
  },
  recurrencePattern: {
    type: String,
    default: '', // Esempio: 'ogni martedì'
  },
  numberOfOccurrences: {
    type: Number,
    default: null, // null se ripeti indefinitamente
  },
  notificationMechanism: {
    type: [String],
    enum: ['system', 'email', 'whatsapp', 'alert'],
    default: [],
  },
  notificationTime: {
    type: Number, // In minuti prima dell'evento
    default: 0,
  },
  repeatNotification: {
    type: Number, // In minuti per la ripetizione della notifica
    default: 0,
  },
  author: {
    type: String,
    required: true,
  },
  participants : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
