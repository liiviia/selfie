const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    heading: String,
    author: { type: String, required:true },
    content: {type: String, required: true},
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Note", noteSchema);
