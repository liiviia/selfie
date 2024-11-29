<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alerts: [],  
      seenAlerts: new Set(),  
    };
  },
  created() {
    this.startPolling();  
  },
  methods: {
  startPolling() {
    const token = sessionStorage.getItem('token');
    setInterval(() => {
      fetch('/api/get-latest-alert', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore nella risposta');
        }
        return response.json();
      })
      .then(data => {
        if (data.alerts && data.alerts.length > 0) {
          const username = localStorage.getItem('username');
          const filteredAlerts = data.alerts.filter(alert => alert.userNome.toLowerCase() === username.toLowerCase());

          if (filteredAlerts.length > 0) {
            this.alerts = filteredAlerts;
            filteredAlerts.forEach(alertItem => {
              alert(`Evento: ${alertItem.title}\nData: ${new Date(alertItem.date).toLocaleDateString()}\nOrario: ${alertItem.startTime}`);
            });
          }
        }
      })
      .catch(err => {
        console.error('Errore nel polling:', err);
      });
    }, 5000); // Intervallo di 5 secondi
  }
}

};
</script>

<style scoped>

</style>
