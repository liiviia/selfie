let timeMachineDate = new Date();


module.exports = {
    getTimeMachineDate: () => timeMachineDate,
    setTimeMachineDate: (newDate) => { timeMachineDate = new Date(newDate); },
    resetTimeMachineDate: () => { timeMachineDate = new Date(); },
};
