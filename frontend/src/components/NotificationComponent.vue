<template>
  <div>
    <h2>Notifiche</h2>
    <ul>
      <li v-for="alert in alerts" :key="alert.title">
        <strong>{{ alert.title }}</strong> - {{ alert.date }} at {{ alert.startTime }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alerts: [],  // Stato per memorizzare gli alert ricevuti
    };
  },
  created() {
    this.startPolling();  // Avvia il polling quando il componente è creato
  },
  methods: {
    startPolling() {
      setInterval(() => {
        fetch('/api/send-test-alert')
          .then(response => {
            if (!response.ok) {
              throw new Error('Errore nella risposta');
            }
            return response.json();  // Converti la risposta in JSON
          })
          .then(data => {
            console.log('Alert ricevuti:', data);
            if (data.alerts && data.alerts.length > 0) {
              this.alerts = data.alerts;  // Aggiorna gli alert nel data
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
