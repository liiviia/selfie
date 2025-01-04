const schedule = require('node-schedule');
const { markUnstartedSessions } = require('./controllers/pomsController');
const timeMachineConfig = require('./timeMachineConfig');

function initializeScheduler() {

  const jobInterval = 60000;

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
  }, jobInterval); 
}

module.exports = { initializeScheduler };
