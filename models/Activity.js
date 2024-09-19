const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  author: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Activity', activitySchema);