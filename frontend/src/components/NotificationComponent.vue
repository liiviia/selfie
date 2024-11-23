<template>
  <div>
    <!-- Non è più necessario visualizzare le notifiche in una lista -->
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created() {
    const fetchAlerts = async () => {
      try {
        const loggedInUser = localStorage.getItem('username');
        const response = await fetch(`/alerts?userNome=${loggedInUser}`);

        const text = await response.text();
        console.log('Risposta dal server:', text);

        if (response.ok) {
          const newAlerts = JSON.parse(text);

          if (Array.isArray(newAlerts) && newAlerts.length > 0) {
            // Quando ci sono notifiche, visualizzale subito come alert() invece di aggiungerle alla lista
            newAlerts.forEach(alert => {
              // Mostra il messaggio di notifica con alert()
              alert(`TITOLO: ${alert.title}\nData: ${alert.date}\nOra di inizio: ${alert.startTime}`);
            });
          } else {
            console.log('Nessuna notifica per l\'utente');
          }
        } else {
          console.error('Errore nella richiesta:', response.statusText);
        }
      } catch (error) {
        console.error('Errore nella richiesta:', error);
      }
    };

    fetchAlerts();
  },
};
</script>

<style scoped>
</style>
