<template>
  <div>
   
  </div>
</template>

<script>
export default {
  data() {
    return {
      alerts: [],  // Stato per memorizzare gli alert ricevuti
      seenAlerts: new Set(),  // Set per memorizzare gli alert già visualizzati
    };
  },
  created() {
    this.startPolling();  // Avvia il polling quando il componente è creato
  },
  methods: {
    startPolling() {
      setInterval(() => {
        fetch('/api/get-latest-alert')
          .then(response => {
            if (!response.ok) {
              throw new Error('Errore nella risposta');
            }
            return response.json();  // Converti la risposta in JSON
          })
          .then(data => {
            //console.log('Alert ricevuti:', data);
            if (data.alerts && data.alerts.length > 0) {
              const username = localStorage.getItem('username');  // Ottieni lo username dal localStorage
              // Filtra gli alert per userNome (username nel localStorage)
              const filteredAlerts = data.alerts.filter(alert => alert.userNome === username);
              console.log('Alert ricevuti:', filteredAlerts);
              
            }
          })
          .catch(err => {
            console.error('Errore nel polling:', err);
          });
      }, 5000); // Esegui il polling ogni 5 secondi
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
strong {
  color: #333;
}
</style>
