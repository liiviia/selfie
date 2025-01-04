const schedule = require('node-schedule');
const { markUnstartedSessions } = require('./controllers/pomsController');
const timeMachineConfig = require('./timeMachineConfig');

function initializeScheduler() {
  const jobInterval = 60000;

  setInterval(async () => {
    console.log('Esecuzione job basato sull\'orario attuale o Time Machine...');
    try {
      // Ottieni la data corrente o dalla Time Machine
      let currentDate = timeMachineConfig.isActive()
        ? timeMachineConfig.getTimeMachineDate()
        : new Date();

      // Verifica che currentDate sia un oggetto `Date`
      if (!(currentDate instanceof Date) || isNaN(currentDate)) {
        console.warn('currentDate non è un oggetto Date valido, reimposto a nuova data.');
        currentDate = new Date();
      }

      console.log(`Data usata per il controllo: ${currentDate.toISOString()}`);

      // Passa la data valida alla funzione `markUnstartedSessions`
      await markUnstartedSessions(currentDate);
      console.log('Job completato: sessioni mai avviate aggiornate.');
    } catch (error) {
      console.error('Errore durante il job di verifica sessioni:', error);
    }
  }, jobInterval);
}

module.exports = { initializeScheduler };
