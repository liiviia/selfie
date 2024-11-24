const Event = require('../models/Event');
const Activity = require('../models/Activity');
const User = require('../models/User');
const timeMachineConfig = require('../timeMachineConfig');
const moment = require('moment-timezone');
const { sendNotifEmail } = require('../services/emailService');
const {sendNotifEmailActivity} = require('../services/emailService');
const { sendAlertNotification } = require('../websocketServer'); 
const sentNotifications = new Set();

const getTimeMachineDate1 = async () => {
  return moment(timeMachineConfig.getTimeMachineDate()).tz('Europe/Rome');
};

const calculateNotificationTime = (event) => {
  let eventDateTimeString;

  if (typeof event.date === 'string') {
    eventDateTimeString = `${event.date.slice(0, 10)}T${event.startTime}:00`;
  } else if (event.date instanceof Date) {
    eventDateTimeString = `${event.date.toISOString().slice(0, 10)}T${event.startTime}:00`;
  } else {
    return null;
  }

  const eventTime = moment(eventDateTimeString).tz('Europe/Rome');

  if (eventTime.isValid() === false) {
    console.error("La data dell'evento non è valida:", eventDateTimeString);
    return null;
  }

  const notificationTime = eventTime.clone().subtract(event.notificationTime, 'minutes');
  return notificationTime.valueOf();
};

const sendNotification = async (event) => {
  if (sentNotifications.has(event._id.toString())) {
    return;
  }


  try {
    if (event.notificationMechanism.includes('email')) {
      let emailRicevente = [];

      if (event.type === 'gruppo') {
        const userEmails = await User.find({ username: { $in: event.participants } }).select('email');
        emailRicevente = userEmails.map(user => user.email);
      } else if (event.type === 'singola') {
        emailRicevente = event.email;
      }

      if (Array.isArray(emailRicevente)) {
        for (const email of emailRicevente) {
          await sendNotifEmail(email, event);
          console.log(`Email inviata a: ${email}`);
        }
      } else {
        await sendNotifEmail(emailRicevente, event);
        console.log(`Email inviata a: ${emailRicevente}`);
      }
    }
    

    if (event.notificationMechanism.includes('alert')) {

      let recipients = [];

      if (event.type === 'gruppo') {
        recipients = event.participants;
      } else if (event.type === 'singola') {
        recipients = [event.author];
      }

      for (const recipient of recipients) {
        sendAlertNotification(event.title, event.date, event.startTime, recipient);
      }


    }
    

    sentNotifications.add(event._id.toString());

    setTimeout(() => {
      sentNotifications.delete(event._id.toString());
    }, 5000);

  } catch (error) {
    console.log('Errore durante l’invio della notifica:', error);
  }
};

const handleRepeatedNotifications = (event, repeatTime) => {
  if (repeatTime > 0) {


    let count = 0;
    const intervalId = setInterval(() => {
      if (count < repeatTime) {
        sendNotification(event);  

        count++;
      } else {
        clearInterval(intervalId);

      }
    }, 60000);  
  }
};


const checkAndSendNotifications = async () => {

  const timeMachineDate = await getTimeMachineDate1();  
  const timeMachineDateInMs = timeMachineDate.valueOf(); 

 

const events = await Event.find({author: 'massi'});
console.log("eeee", events);




  for (const event of events) {
    const notificationDateInMs = calculateNotificationTime(event);
    console.log("time machine in ms",timeMachineDateInMs, "time machine normale");
    console.log("notification time eventi", notificationDateInMs);

    const TOLLERANZA_MS = 10; 

if (notificationDateInMs !== null) {
  if (timeMachineDateInMs >= (notificationDateInMs - TOLLERANZA_MS) && timeMachineDateInMs <= (notificationDateInMs + TOLLERANZA_MS)) {
 
    await sendNotification(event); 
    handleRepeatedNotifications(event, event.repeatNotification); 
  } else {
  
  }
}

  }
};

const startNotificationMonitoring = () => {

  setInterval(checkAndSendNotifications, 1000);

  setInterval(checkAndSendActivityNotifications, 1000);
};

const checkAndSendActivityNotifications = async () => {
  const timeMachineDate = await getTimeMachineDate1();  
  const timeMachineDateInMsA = timeMachineDate.valueOf(); 
  //console.log(timeMachineDate);


  const activities = await Activity.find({ completed: false });

  //console.log("attivita",activities);

  

  for (const activity of activities) {

    const notificationTimes = calculateNotificationTimeActivity(activity);

    const TOLLERANZA_MS = 3600000; 

    if (notificationTimes !== null) {
      for (const notificationTime of notificationTimes) {

        const localNotificationTime = moment.utc(notificationTime).local().valueOf();

        const diff = Math.abs(localNotificationTime - timeMachineDateInMsA);
//        console.log("differenza attivita:", diff);


        if (timeMachineDateInMsA == localNotificationTime - TOLLERANZA_MS) {

          await sendNotificationA(activity); 

          console.log(`Notifica inviata per l'attività: ${activity.title} alle: ${new Date(timeMachineDateInMsA).toLocaleString()}`);
          console.log("------------------------------");
        }
      }
    }
  }
};

const sendNotificationA = async (activity) => {
  let emails = [];

  if (activity.type === 'gruppo') {
    const userEmails = await User.find({ username: { $in: activity.participants } }).select('email');
    emails = userEmails.map(user => user.email);
  }
  else if (activity.type === 'singola') {
    emails = [activity.email];
  }

  for (const email of emails) {
    await sendNotifEmailActivity(email, activity);
  }
};



const calculateNotificationTimeActivity = (activity) => {
  const notificationTimes = [];

  notificationTimes.push(moment(activity.deadline).valueOf());

  notificationTimes.push(moment(activity.deadline).add(6, 'hours').valueOf());

  notificationTimes.push(moment(activity.deadline).add(9, 'hours').valueOf());

  notificationTimes.push(moment(activity.deadline).add(10, 'hours').valueOf());

  
  return notificationTimes;
};


module.exports = {
  startNotificationMonitoring,
};
