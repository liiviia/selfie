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
      alerts: [],
    };
  },
  created() {
    // Connetti al server SSE
    const eventSource = new EventSource('http://site232432.tw.cs.unibo.it:8000/sse');

    // Ascolta i messaggi dal server
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Alert ricevuto:', data);

      const loggedInUser = localStorage.getItem('username'); // Verifica l'utente loggato

      if (data.userNome === loggedInUser) {
        alert(`TITOLO: ${data.title}\nOra di inizio: ${data.startTime}\nDi utente: ${data.userNome}`);
        this.alerts.push(data); // Aggiungi l'alert alla lista
      }
    };

    eventSource.onerror = (error) => {
      console.error('Errore SSE:', error);
    };
  },
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
