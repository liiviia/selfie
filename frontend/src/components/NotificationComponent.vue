<template>
  <div>
    <!-- Non è necessario visualizzare notifiche in una lista, ma si possono processare qui -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      intervalId: null, // Per memorizzare l'ID dell'intervallo
    };
  },
  created() {
    const fetchAlerts = async () => {
      try {
        const loggedInUser = localStorage.getItem('username');
        const response = await fetch(`/alerts?userNome=${loggedInUser}`);

        if (response.ok) {
          // Verifica se la risposta è vuota
          const text = await response.text(); // Ottieni la risposta come testo

          if (text.trim() === "") {
            console.log('Nessuna notifica disponibile per l\'utente');
            return; // Se la risposta è vuota, non fare nulla
          }

          // Controlla che la risposta sia in formato JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const newAlerts = JSON.parse(text);

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

    // Esegui `fetchAlerts` ogni secondo
    this.intervalId = setInterval(fetchAlerts, 1000); // 1000ms = 1 secondo
  },
  beforeUnmount() {
    // Quando il componente viene distrutto, cancella l'intervallo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style scoped>
/* Stilizzazione personalizzata, se necessaria */
</style>
