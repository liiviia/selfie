<template>
  <div>
    <!-- Non è necessario visualizzare notifiche in una lista, ma si possono processare qui -->
  </div>
</template>

<script>
import axios from 'axios'; // Importa Axios
import moment from 'moment-timezone';

export default {
  data() {
    return {
      intervalId: null, // Per memorizzare l'ID dell'intervallo
    };
  },
  created() {
    

const timeMachine = async () => {
  try {
        const response = await axios.get('/api/getTime-machine'); 
        console.log("get time machine", response.data);

        const localDate = moment(response.data.date).tz('Europe/Rome', true).format();
        console.log("Data convertita nel fuso orario locale:", localDate);
    } catch (error) {
        console.error('Errore nella richiesta GET:', error);
    }

};
    const fetchAlerts = async () => {
      try {
        const loggedInUser = localStorage.getItem('username');

        // Utilizza Axios per fare la richiesta GET
        const response = await axios.get(`/alerts?userNome=${loggedInUser}`);
        console.log("Risposta Axios:", response);

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Quando ci sono notifiche, visualizzale subito come alert()
          response.data.forEach(alert => {
            alert(`TITOLO: ${alert.title}\nData: ${alert.date}\nOra di inizio: ${alert.startTime}`);
          });
        } else {
          console.log('Nessuna notifica per l\'utente');
        }
      } catch (error) {
        // Gestisci gli errori
        console.error('Errore nella richiesta Axios:', error);
      }
    };

    // Esegui `fetchAlerts` ogni secondo
    this.intervalId = setInterval(fetchAlerts, timeMachine, 1000); // 1000ms = 1 secondo
  },

  beforeUnmount() {
    // Quando il componente viene distrutto, cancella l'intervallo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style scoped>
/* Stilizzazione personalizzata, se necessaria */
</style>
