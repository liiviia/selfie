const Pom = require('./models/pom'); 


const checkPomodoroAgainstTimeMachine = async (timeMachineDate) => {

  
    try {
        const results = await Pom.find({
            giorno: { $lt: timeMachineDate },
            isStarted: false,
        });

        results.forEach((pom) => {
            console.log(`Pomodoro da controllare:`, pom);
        });

        if (results.length === 0) {
            console.log('Nessun pomodoro da controllare rispetto alla Time Machine.');
        }
    } catch (error) {
        console.error('Errore durante il controllo dei pomodoros:', error);
    }
};

module.exports = {
  checkPomodoroAgainstTimeMachine
};

