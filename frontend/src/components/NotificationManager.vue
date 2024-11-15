<template>
  <div></div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NotificationManager',

  data() {
    return {
      events: [], 
      currentDate: new Date(), 
      notifiedEvents: new Set(),
      eventTimers: new Map(),
      timeMachineDate: new Date(), 
    };
  },

  methods: {
    async requestNotificationPermission() {
      try {
        if ('Notification' in window) {
          const permesso = await Notification.requestPermission();
          console.log("Permesso: ", permesso);
          if (permesso === 'granted') {
            console.log('Permesso notifiche di sistema concesso');
          } else {
            console.warn('Permesso notifiche di sistema negato');
          }
        }
      } catch (error) {
        console.error('Errore nella richiesta del permesso:', error);
      }
    },



    async sendEmailNotification(event, emailRicevente) {
  try {
    const token = sessionStorage.getItem('token');
    
    const sendEmail = async () => {
      try {
        await axios.post('/api/events/email', {
          emailRicevente,
          eventDetails: event
        }, {
          headers: {
            Authorization: `Bearer ${token}`  
          }
        });
        console.log('Notifica email inviata con successo');
      } catch (error) {
        console.error('Errore durante invio della notifica email:', error);
      }
    };

    await sendEmail();

  } catch (error) {
    console.error('Errore durante il processo di invio delle notifiche email:', error);
  }
},


sendAlertNotification(event) {
  if (this.notifiedEvents.has(event.id)) {
    return;
  }
  window.alert(`Nuovo Evento: ${event.title}\nInizio alle ${event.startTime} del giorno ${event.date}`);
  this.notifiedEvents.add(event.id);
},



    async fetchEvents() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username'); 
        const response = await axios.get('/api/eventsGET', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: username }
        });
        console.log(response.data);
        
        this.events = response.data;
        
        this.events.forEach(event => {
          const emailRicevente = localStorage.getItem('email');
        console.log("Eventi trovati");
       console.log(event,emailRicevente);
        });
      } catch (error) {
        console.error('Errore nel recupero degli eventi:', error);
      }
    },

    async scheduleNotification(event, emailRicevente) {
  console.log("Schedulazione notifiche...");
  console.log("Evento passato", event);

  if (this.eventTimers.has(event.id)) {
    console.log("Timer già esistente per l'evento", event.id);
    clearTimeout(this.eventTimers.get(event.id));  
    this.eventTimers.delete(event.id);  
  }

  try {
    console.log("Chiamata API iniziata...");
    const response = await axios.get('/api/getTime-machine');
    //console.log("Time machine data:", response.data);

    const timeMachineNow = new Date(response.data).getTime();
    console.log("Time Machine Current Time:", timeMachineNow);

    const eventDateTimeString = `${event.date.slice(0, 10)}T${event.startTime}:00`;
    const eventTime = new Date(eventDateTimeString).getTime();
    console.log("Event Time:", eventTime);

    if (isNaN(eventTime)) {
      console.error("La data dell'evento non è valida:", eventDateTimeString);
      return;
    }

    const notificationTime = eventTime - event.notificationTime * 60000;
    console.log("Notification Time:", notificationTime);

    const timeUntilNotification = notificationTime - timeMachineNow;
    console.log("Time Until Notification:", timeUntilNotification);

    if (timeUntilNotification > 0) {
      const timerId = setTimeout(() => {
        console.log("Triggering notifications for event:", event.title);
        this.triggerNotifications(event, emailRicevente);
      }, timeUntilNotification);

      this.eventTimers.set(event.id, timerId);
    } else {
      console.warn("L'orario della notifica è già passato o non è valido.");
    }
  } catch (error) {
    console.error("Errore durante la richiesta della Time Machine:", error);
  }
},


    triggerNotifications(event, emailRicevente) {
      console.log("Evento notifica meccanismo:", event.notificationMechanism);

      if (this.notifiedEvents.has(event.id)) {
        return;
      }

      if (event.notificationMechanism.includes('system')) {
        this.sendSystemNotification(event);
      }
      if (event.notificationMechanism.includes('email')) {
        this.sendEmailNotification(event, emailRicevente);
      }
      if (event.notificationMechanism.includes('alert')) {
        this.sendAlertNotification(event);
      }

      this.notifiedEvents.add(event.id);
    },

    async fetchTimeMachineDate() {
      try {
        const response = await axios.get('/api/getTime-machine');
        this.timeMachineDate = new Date(response.data);
        console.log("Time Machine Date Updated:", this.timeMachineDate);
      } catch (error) {
        console.error('Errore nel recupero della Time Machine:', error);
      }
    },
  },

  watch: {
    timeMachineDate(newDate, oldDate) {
      if (newDate !== oldDate) {
        console.log("La data della Time Machine è cambiata!");
        this.fetchEvents(); 
      }
    }
  },

  mounted() {
    this.requestNotificationPermission(); 
    this.fetchEvents();  
    
    this.fetchTimeMachineDate();

    setInterval(this.fetchTimeMachineDate, 1000); 
  },

  beforeUnmount() {
    this.eventTimers.forEach(timerId => clearTimeout(timerId));
    this.eventTimers.clear();
  }
};
</script>
