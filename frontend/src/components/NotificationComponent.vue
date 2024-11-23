<template>
  <div>
    <ul>
      <li v-for="alert in alerts" :key="alert.title">
        {{ alert.title }} - {{ alert.date }} - {{ alert.startTime }}
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
    const fetchAlerts = async () => {
      try {
        const loggedInUser = localStorage.getItem('username'); 
        const response = await fetch(`/alerts?userNome=${loggedInUser}`);
        if (response.ok) {
          const newAlerts = await response.json();
          this.alerts.push(...newAlerts); 
          newAlerts.forEach(alert => {
            alert(`TITOLO: ${alert.title}\nOra di inizio: ${alert.startTime}\nDi utente: ${alert.userNome}`);
          });
        } else {
          console.error('Errore durante il polling:', response.statusText);
        }
      } catch (error) {
        console.error('Errore nella richiesta:', error);
      } finally {
        setTimeout(fetchAlerts, 1000);
      }
    };

    fetchAlerts();
  },
};
</script>

<style scoped>
</style>
