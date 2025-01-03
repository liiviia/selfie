const express = require('express');
const path = require('path');
const connectDB = require('./config/dbConnection');
const cors = require('cors');
const cron = require('node-cron');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const pomsRoutes = require('./routes/pomsRouter');
const eventRoutes = require('./routes/eventRoutes');
const accountRoutes = require('./routes/accountRoutes');
const activityRoutes = require('./routes/activityRoutes');
const registerRoutes = require('./routes/registerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const timeMachineRoutes = require('./routes/timeMachineRoutes');
const timeMachineConfig = require('./timeMachineConfig');
const alertRoutes = require('./routes/alertRoutes');
const Pom = require('./models/pom'); 

// Aggiungi la rotta per gli alert
const moment = require('moment-timezone');
const { startNotificationMonitoring } = require('./controllers/notificheEventi');
const http = require('http');

require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const port = 8000;

const server = http.createServer(app);

app.use(cors({
  origin: 'http://site232432.tw.cs.unibo.it',
  methods: ['GET', 'POST'],
  credentials: true,
}));

connectDB();

const incrementTimeMachine = () => {
  const currentTime = moment(timeMachineConfig.getTimeMachineDate()).tz('Europe/Rome');
  const updatedTime = currentTime.add(1, 'seconds').toDate();
  timeMachineConfig.setTimeMachineDate(updatedTime);

};

setInterval(incrementTimeMachine, 1000);

startNotificationMonitoring();


cron.schedule('0 0 * * *', async () => { // Lo eseguo ogni giorno a mezzanotte
  try {
    console.log('Esecuzione del controllo sessioni incomplete...');

    const currentTime = timeMachineConfig.isActive()
      ? moment(timeMachineConfig.getTimeMachineDate()).tz('Europe/Rome')
      : moment().tz('Europe/Rome');

    const allIncompleteSessions = await Pom.find({
      $or: [
        { remainingTime: { $gt: 0 } },
        { studyCycles: { $gt: 0 } }
      ]
    });

    let updatedSessionsCount = 0;

    for (const session of allIncompleteSessions) {
      const sessionDate = moment(session.giorno).tz('Europe/Rome');

      if (sessionDate.isBefore(currentTime, 'day')) {
        session.isIncomplete = true; 
        await session.save();
        updatedSessionsCount++;
      }
    }

    console.log(`Controllo completato: ${updatedSessionsCount} sessioni incomplete aggiornate.`);
  } catch (error) {
    console.error('Errore durante il controllo delle sessioni incomplete:', error);
  }
});



app.use(express.json());  
app.use('/api/auth', authRoutes);
app.use('/api', noteRoutes);
app.use('/api', pomsRoutes);
app.use('/api', eventRoutes);
app.use('/api', activityRoutes);
app.use('/api', alertRoutes);
app.use('/api', registerRoutes);
app.use('/api', accountRoutes);
app.use('/api', timeMachineRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(express.static(path.join(__dirname, 'frontend/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/frontend/dist', 'index.html'));
});


server.listen(port, () => {
  console.log(`Server running at site232432.tw.cs.unibo.it:${port}`);
});
