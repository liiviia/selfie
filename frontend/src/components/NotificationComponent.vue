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
            console.log('Dati ricevuti:', data); // Mostra cosa contiene la risposta
            
            // Verifica che ci siano alert e che la risposta non sia vuota
            if (data.alerts && data.alerts.length > 0) {
              const username = localStorage.getItem('username');  // Ottieni lo username dal localStorage
              console.log('Username dal localStorage:', username); // Verifica il valore di username
              
              // Filtra gli alert per lo userNome
              const filteredAlerts = data.alerts.filter(alert => alert.userNome.toLowerCase() === username.toLowerCase());
              console.log('Alert filtrati:', filteredAlerts); // Mostra gli alert filtrati

              // Se ci sono alert filtrati, aggiornali nel data
              if (filteredAlerts.length > 0) {
                this.alerts = filteredAlerts;  // Imposta gli alert nel componente
              }
            } else {
              console.log('Nessun alert trovato.');
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
