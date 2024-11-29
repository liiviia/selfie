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
      setInterval(() => {
        fetch('/api/get-latest-alert')
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
             // console.log('Alert filtrati:', filteredAlerts); 

              if (filteredAlerts.length > 0) {
                this.alerts = filteredAlerts;  
                filteredAlerts.forEach(alertItem => {
                 alert(`Evento: ${alertItem.title}\nData: ${new Date(alertItem.date).toLocaleDateString()}\nOrario: ${alertItem.startTime}`);
        });

              }
            } else {
              //console.log('Nessun alert trovato.');
            }
          })
          .catch(err => {
            console.error('Errore nel polling:', err);
          });
      }, 5000); 
    }
  }
};
</script>

<style scoped>

</style>
