const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  message: { type: String, required: true },
  username: {type: String, required: true},
  isRead: { type: Boolean, default: false },    
  createdAt: { type: Date, default: Date.now }, 
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
