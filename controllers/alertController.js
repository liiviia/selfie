const { v4: uuidv4 } = require('uuid');

let alerts = []; // Array che simula gli alert (può essere un DB in produzione)

// Funzione che restituisce gli alert non ancora visti
exports.getLatestAlerts = async (req, res) => {
  try {
    // Filtra gli alert che non sono ancora stati visti
    const unseenAlerts = alerts.filter(alert => !alert.seen);

    // Ritorna solo gli alert che non sono stati visti
    res.json({
      alerts: unseenAlerts,
    });

    // Segna gli alert come visti
    unseenAlerts.forEach(alert => {
      alert.seen = true; // Segna l'alert come visto
    });

  } catch (error) {
    console.error('Errore nel recupero degli alert:', error);
    res.status(500).json({ message: 'Errore nel recupero degli alert' });
  }
};

// Funzione che aggiunge un alert
exports.addAlert = (title, date, startTime, userNome) => {
  const newAlert = { 
    id: uuidv4(), 
    title, 
    date, 
    startTime, 
    userNome,
    seen: false,  // Gli alert appena creati non sono visti
  };
  alerts.push(newAlert);
  console.log("Nuovo alert aggiunto:", newAlert);
};
