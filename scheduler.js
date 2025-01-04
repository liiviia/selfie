const schedule = require('node-schedule');
const { markUnstartedSessions } = require('./controllers/pomodoroController');
const timeMachineConfig = require('./timeMachineConfig');

function initializeScheduler() {
  setInterval(async () => {
    console.log('Esecuzione job basato sull\'orario attuale o Time Machine...');
    try {

        const currentDate = timeMachineConfig.isActive()
        ? timeMachineConfig.getTimeMachineDate()
        : new Date();

      console.log(`Data usata per il controllo: ${currentDate}`);

      await markUnstartedSessions(currentDate);
      console.log('Job completato: sessioni mai avviate aggiornate.');
    } catch (error) {
      console.error('Errore durante il job di verifica sessioni:', error);
    }
  }, 1000); 
}

module.exports = { initializeScheduler };
