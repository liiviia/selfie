const Event = require('../models/Event');
const timeMachineConfig = require('../timeMachineConfig');
const moment = require('moment-timezone');
const { sendNotifEmail } = require('../services/emailService');
const { sendAlertNotification } = require('../websocketServer'); 
const sentNotifications = new Set();

const getTimeMachineDate1 = async () => {
  //console.log("GET TIME MACHINE:", moment(timeMachineConfig.getTimeMachineDate()).tz('Europe/Rome'));
  return moment(timeMachineConfig.getTimeMachineDate()).tz('Europe/Rome');
};

const calculateNotificationTime = (event) => {
  let eventDateTimeString;

  if (typeof event.date === 'string') {
    eventDateTimeString = `${event.date.slice(0, 10)}T${event.startTime}:00`;
  } else if (event.date instanceof Date) {
    eventDateTimeString = `${event.date.toISOString().slice(0, 10)}T${event.startTime}:00`;
  } else {
    //console.error("Tipo di data evento non valido:", event.date);
    return null;
  }

  const eventTime = moment(eventDateTimeString).tz('Europe/Rome');
 // console.log("event time", eventTime.format('YYYY-MM-DD HH:mm:ss'));

  if (eventTime.isValid() === false) {
    //console.error("La data dell'evento non è valida:", eventDateTimeString);
    return null;
  }

  const notificationTime = eventTime.clone().subtract(event.notificationTime, 'minutes');
 // console.log("quando inviare notifica", notificationTime.format('YYYY-MM-DD HH:mm:ss'));
  return notificationTime.valueOf();
};

const sendNotification = async (event) => {
  if (sentNotifications.has(event._id.toString())) {
   // console.log(`Notifica già inviata per l'evento: ${event.title}`);
    return;
  }

  //console.log("Notifica inviata per l'evento:", event.title);

  try {
    if (event.notificationMechanism.includes('email')) {
    //  const emailRicevente = event.email;
      await sendNotifEmail(emailRicevente, event);
      console.log("Email inviata correttamente");
    }
    

    if (event.notificationMechanism.includes('alert')) {

      sendAlertNotification(event.title, event.date, event.startTime, event.author);


    //  console.log("Alert inviato per l'evento:", event.title);
    }
    

    sentNotifications.add(event._id.toString());

    setTimeout(() => {
      sentNotifications.delete(event._id.toString());
    }, 5000);

  } catch (error) {
   // console.log('Errore durante l’invio della notifica:', error);
  }
};

const handleRepeatedNotifications = (event, repeatTime) => {
  if (repeatTime > 0) {
  //  console.log(`Invio notifiche ripetute per l'evento: ${event.title}`);

    let count = 0;
    const intervalId = setInterval(() => {
      if (count < repeatTime) {
        sendNotification(event);  
     //   console.log(`Notifica inviata ${count + 1} volta per l'evento: ${event.title}`);
        count++;
      } else {
        clearInterval(intervalId);
      //  console.log(`tutte notifiche inviate per evento: ${event.title}`);
      }
    }, 60000);  
  }
};


const checkAndSendNotifications = async () => {
 // console.log("Controllo notifiche eventi");
  const timeMachineDate = await getTimeMachineDate1();  
  const timeMachineDateInMs = timeMachineDate.valueOf(); 

  //console.log("time Machine to date::", timeMachineDate.format('YYYY-MM-DD HH:mm:ss'));
  //console.log("tm in ms::" ,timeMachineDateInMs);
  //console.log("itme machine time minuti ore", timeMachineDate.format('HH:mm'));

const events = await Event.find();



  //console.log("eventi non scaduti:::::::", events);

  for (const event of events) {
    const notificationDateInMs = calculateNotificationTime(event);

    const TOLLERANZA_MS = 10; 

if (notificationDateInMs !== null) {
  if (timeMachineDateInMs >= (notificationDateInMs - TOLLERANZA_MS) && timeMachineDateInMs <= (notificationDateInMs + TOLLERANZA_MS)) {
   // console.log("notification time in ms", notificationDateInMs);
    //console.log(`Inviando notifica per l'evento: ${event.title}`);
    await sendNotification(event); 
    handleRepeatedNotifications(event, event.repeatNotification); 
  } else {
   // console.log("notification time in ms", notificationDateInMs);
    //console.log("time machine in ms", timeMachineDateInMs);
    //console.log(`Evento scaduto o notifica non ancora da inviare: ${event.title}`);
  }
}

  }
};

const startNotificationMonitoring = () => {
  console.log("Monitoraggio notifiche eventi");
  setInterval(checkAndSendNotifications, 1000);
};

module.exports = {
  startNotificationMonitoring,
};
