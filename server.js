const express = require('express');
const path = require('path');
const connectDB = require('./config/dbConnection');
const cors = require('cors');
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
const { initializeScheduler } = require('./scheduler');
const { markUnstartedSessions } = require('./controllers/pomsController');

// Aggiungi la rotta per gli alert
const moment = require('moment-timezone');
const { startNotificationMonitoring } = require('./controllers/notificheEventi');
const http = require('http');

require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

initializeScheduler();

const updateUnstartedSessions = () => {
  console.log('Esecuzione aggiornamento delle sessioni non avviate...');
  markUnstartedSessions();
};


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

setInterval(async () => {
  console.log('Esecuzione job aggiornamento sessioni non avviate...');
  await markUnstartedSessions();
  console.log('Aggiornamento completato.');
}, 60 * 1000);


startNotificationMonitoring();

app.use(express.json());  
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/poms', pomsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/time-machine', timeMachineRoutes);
app.use('/api/notifications', notificationRoutes);


app.use(express.static(path.join(__dirname, 'frontend/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/frontend/dist', 'index.html'));
});


server.listen(port, () => {
  console.log(`Server running at site232432.tw.cs.unibo.it:${port}`);
});
