const { v4: uuidv4 } = require('uuid');

let alerts = []; // Array che simula gli alert (può essere un DB in produzione)
let sentAlerts = new Set(); // Set per tracciare gli alert inviati

// Funzione che restituisce gli alert più recenti
exports.getLatestAlerts = async (req, res) => {
  try {
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
  // Crea un identificatore unico per ogni alert
  const alertId = uuidv4(); // Usa uuid per generare un ID unico per ogni alert
  const newAlert = { id: alertId, title, date, startTime, userNome };

  // Controlla se l'alert è già stato inviato
  if (!sentAlerts.has(alertId)) {
    alerts.push(newAlert);
    sentAlerts.add(alertId); // Aggiungi l'ID dell'alert al set di quelli inviati
    console.log("Nuovo alert aggiunto:", newAlert);
  } else {
    console.log("Alert già inviato:", newAlert);
  }
};
