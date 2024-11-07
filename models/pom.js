const mongoose = require('mongoose');

const pomSchema = new mongoose.Schema({
    username: {type: String, required: true },
    tempoStudio: {type: Number, required: true},
    tempoPausa: {type: Number, required: true},
    ripetizioni: {type: Number, required: true},
    giorno: {type: Date, required: true}
});

module.exports = mongoose.model("Pom", pomSchema);
