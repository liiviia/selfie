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
setInterval(() => {
  fetch('/api/alerts/get-latest-alert') // Percorso per ottenere gli alert
    .then(response => response.json())
    .then(data => {
      if (data.alerts && data.alerts.length > 0) {
        // Mostra gli alert nel frontend (es. con una notifica)
        data.alerts.forEach(alert => {
          alert(`Alert ricevuto: ${alert.title}\nData: ${alert.date}\nOra di inizio: ${alert.startTime}`);
        });
      }
    })
    .catch(err => console.error('Errore nel polling:', err));
}, 5000); // Esegui il polling ogni 5 secondi
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
