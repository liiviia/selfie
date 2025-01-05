let timeMachineDate = new Date();
let isTimeMachineActive = false;

module.exports = {
    getTimeMachineDate: () => timeMachineDate,
    setTimeMachineDate: (newDate) => { timeMachineDate = new Date(newDate); },
    resetTimeMachineDate: () => { timeMachineDate = new Date(); },
    isActive: () => isTimeMachineActive,
    activate: () => { isTimeMachineActive = true; },
    deactivate: () => { isTimeMachineActive = false; },
};
