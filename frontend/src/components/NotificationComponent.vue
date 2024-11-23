<template>
  <div>
    <!-- Non è necessario visualizzare notifiche in una lista, ma si possono processare qui -->
  </div>
</template>

<script>
export default {
  created() {
    const fetchAlerts = async () => {
      try {
        const loggedInUser = localStorage.getItem('username');
        const response = await fetch(`/alerts?userNome=${loggedInUser}`);

        if (response.ok) {
          // Controlla che la risposta sia in formato JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const newAlerts = await response.json();

            if (Array.isArray(newAlerts) && newAlerts.length > 0) {
              // Quando ci sono notifiche, visualizzale subito come alert()
              newAlerts.forEach(alert => {
                alert(`TITOLO: ${alert.title}\nData: ${alert.date}\nOra di inizio: ${alert.startTime}`);
              });
            } else {
              console.log('Nessuna notifica per l\'utente');
            }
          } else {
            console.error('La risposta del server non è in formato JSON');
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
/* Stilizzazione personalizzata, se necessaria */
</style>
