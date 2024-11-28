let alerts = []; // Array che simula gli alert (può essere un DB in produzione)

// Funzione che restituisce gli alert più recenti
exports.getLatestAlerts = async (req, res) => {
  try {
    // Puoi aggiungere logica per filtrare o recuperare gli ultimi alert da un DB
    res.json({
      alerts: alerts, // Ritorna tutti gli alert presenti
    });
  } catch (error) {
    console.error('Errore nel recupero degli alert:', error);
    res.status(500).json({ message: 'Errore nel recupero degli alert' });
  }
};

// Funzione che aggiunge un alert
exports.addAlert = (title, date, startTime, userNome) => {
  const newAlert = { title, date, startTime, userNome };
  alerts.push(newAlert);
  console.log("Nuovo alert aggiunto:", newAlert);
};
