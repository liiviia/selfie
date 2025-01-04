let timeMachineDate = new Date();
let isTimeMachineActive = false; // Variabile per tracciare lo stato della time machine

module.exports = {
    getTimeMachineDate: () => {
        if (!(timeMachineDate instanceof Date) || isNaN(timeMachineDate.getTime())) {
            console.error('timeMachineDate non è valido:', timeMachineDate);
            timeMachineDate = new Date(); // Usa la data corrente come fallback
        }
        return timeMachineDate;
    },
    setTimeMachineDate: (newDate) => {
        const parsedDate = new Date(newDate);
        if (isNaN(parsedDate.getTime())) {
            console.error('Data non valida fornita a setTimeMachineDate:', newDate);
            throw new Error('Data non valida');
        }
        timeMachineDate = parsedDate;
    },
    resetTimeMachineDate: () => {
        console.log('Time Machine resettata alla data corrente');
        timeMachineDate = new Date();
    },
    isActive: () => isTimeMachineActive,
    activate: () => {
        console.log('Time Machine attivata');
        isTimeMachineActive = true;
    },
    deactivate: () => {
        console.log('Time Machine disattivata');
        isTimeMachineActive = false;
    },
};
