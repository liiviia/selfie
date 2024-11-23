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

    const dateTimeLocal = moment(date).tz('Europe/Rome', true).format(); 

    if (!moment(dateTimeLocal).isValid()) {
        return res.status(400).json({ message: 'Data non valida' });
    }

    timeMachineConfig.setTimeMachineDate(dateTimeLocal);

    res.status(200).json({
        message: 'Time Machine aggiornata con successo',
        timeMachineDate: dateTimeLocal
    });
};

exports.resetTimeMachineDate = (req, res) => {
    timeMachineConfig.resetTimeMachineDate();
    res.status(200).json({ message: 'Time Machine resettata alla data di sistema' });
};
