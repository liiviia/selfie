<template>
  <div>
   
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
              console.log('Alert filtrati:', filteredAlerts); 

              if (filteredAlerts.length > 0) {
                this.alerts = filteredAlerts; 
                filteredAlerts.forEach(alert => {
                  alert(`Nuovo alert: ${alert.title}`);
                }); 
              }
            } else {
              console.log('Nessun alert trovato.');
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
