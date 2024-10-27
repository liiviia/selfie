
<template>
  <div></div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'NotificationManager',
  
  methods: {

     //permesso notifiche
     async requestNotificationPermission(){
      try {
        if ('Notification' in window) {
        const permesso=await Notification.requestPermission();
        console.log("permesso: ", permesso);
        if (permesso === 'granted') {
          console.log('Permesso notifiche di sistema concesso');
        }else{
          console.warn('Permesso notifiche di sistema neagtoo');
        }
      }
      } catch (error) {
          console.error('Errore nella richiesta del permesso:', error);
      }
    },


    async sendEmailNotification(event,emailRicevente){
      try {
        const token = sessionStorage.getItem('token');

        await axios.post('/api/events/email', {
          emailRicevente,
          eventDetails: event
        }, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
      console.log('Notifica email inviata con successo');
      } catch (error) {
        console.error('Errore durante invio della notifica email:', error);
      }
    },

   
    //Notifica di sistema --> visibile anche quando l'utente non è sull app
    sendSystemNotification(event) {
      if (!event) {
        console.warn("I dati dell'evento sono incompleti. Notifica non inviata.");
        return;
      } 
      if (Notification.permission === 'granted') {
        const notification = new Notification(`Nuovo Evento: ${event.title}`, {
        body: `L'evento inizia alle ${event.startTime} del giorno ${event.date}`,  
      });

        notification.onclick = () => {
          window.focus();
        };

      }else{
        console.error('Il permesso per le notifiche non è stato concesso.');
      }
    },

    //notifica alert
    sendAlertNotification(event){
      window.alert(`Nuovo Evento: ${event.title}\nInizio alle ${event.startTime} del giorno ${event.date}`);
    },
    
    //scheduler notifiche
    scheduleNotification(event, emailRicevente){
      const eventTime = new Date(`${event.date}T${event.startTime}`).getTime(); //orario inizio evento in millisecondi
      const notificationTime = eventTime - event.notificationTime * 60000;  //ora in cui mostro la notifica
      const timeUntilNotification = notificationTime - Date.now();

      if (isNaN(eventTime) || isNaN(notificationTime) || timeUntilNotification <= 0) {
        console.warn("L'orario della notifica è già passato o non è valido.");
        return;
      }

      if (timeUntilNotification > 0) {    //controllo che il tempo rimanente sia positivo
        setTimeout(() => {
          this.triggerNotifications(event, emailRicevente);
          if (event.repeatNotification > 0) {
            setInterval(() => {
              this.triggerNotifications(event, emailRicevente);
            }, event.repeatNotification * 60000);
          }
        }, timeUntilNotification);
      } else {
        console.warn("L'ora di notifica è già passata o il tempo è impostato a meno di 0 minuti.");
      }
    }, 
    
    
    triggerNotifications(event, emailRicevente) {
      if (event.notificationMechanism.includes('system')) {
        this.sendSystemNotification(event);
      }
      if (event.notificationMechanism.includes('email')) {
        this.sendEmailNotification(event, emailRicevente);
      }
      // if (event.notificationMechanism.includes('whatsapp')) {
      //   this.sendWhatsAppNotification(event);
      // }
      if (event.notificationMechanism.includes('alert')) {
        this.sendAlertNotification(event);
      }
    },

    
  },

  
  mounted(){
    this.requestNotificationPermission(); //richiede il permesso per le notifiche di sistema
  },


};

</script>