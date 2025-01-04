const timeMachineConfig = require('../timeMachineConfig');
const moment = require('moment-timezone');

exports.getTimeMachineDate = (req, res) => {
    const timeMachineDate = timeMachineConfig.getTimeMachineDate();

    const localTime = moment(timeMachineDate).tz('Europe/Rome').format();

    return res.send(localTime);  
};


exports.updateTimeMachineDate = (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ message: 'Data non fornita' });
    }

    // Forzo il formato UTC per evitare errori
    const dateTimeUTC = moment.tz(date, 'Europe/Rome').utc().format(); 

    if (!moment(dateTimeUTC).isValid()) {
        return res.status(400).json({ message: 'Data non valida' });
    }

    timeMachineConfig.setTimeMachineDate(dateTimeUTC);

    res.status(200).json({
        message: 'Time Machine aggiornata con successo',
        timeMachineDate: dateTimeUTC
    });
};


exports.resetTimeMachineDate = (req, res) => {
    timeMachineConfig.resetTimeMachineDate();
    res.status(200).json({ message: 'Time Machine resettata alla data di sistema' });
};

exports.activateTimeMachine = (req, res) => {
    timeMachineConfig.activate();
    res.json({ message: 'Time Machine attivata' });
  };
  
  exports.deactivateTimeMachine = (req, res) => {
    timeMachineConfig.deactivate();
    res.json({ message: 'Time Machine disattivata, utilizzo orario reale' });
  };
  
