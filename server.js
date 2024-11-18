const express = require('express');
const path = require('path');
//const connectDB = require('./config/dbConnection');
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
const moment = require('moment-timezone');
const { startNotificationMonitoring } = require('./controllers/notificheEventi');
const { initializeWebSocket } = require('./websocketServer');
const http = require('http');

require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const port = 8000;

const server = http.createServer(app);
initializeWebSocket(server);



app.use(cors({
  origin: 'http://site232432.tw.cs.unibo.it',
  methods: ['GET', 'POST'],
  credentials: true,
}));



const mongoDBUri = "mongodb://site232432:ahB4ha7j@mongo_site232432:27017/site232432"; 
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => console.log("Connesso a MongoDB"));
mongoose.connection.on("reconnected", () => console.log("Riconnesso a MongoDB"));
mongoose.connection.on("disconnected", () => console.log("Disconnesso da MongoDB"));
mongoose.connection.on("error", (err) => console.error("Errore di connessione a MongoDB:", err));

process.on("SIGINT", () => {
    mongoose.connection.close()
        .then(() => {
            console.log("Connessione MongoDB chiusa");
            process.exit(0);
        })
        .catch(err => {
            console.error("Errore durante la chiusura della connessione MongoDB:", err);
            process.exit(1);
        });
});





const incrementTimeMachine = () => {
  const currentTime = moment(timeMachineConfig.getTimeMachineDate()).tz('Europe/Rome');
  const updatedTime = currentTime.add(1, 'seconds').toDate();
  timeMachineConfig.setTimeMachineDate(updatedTime);
};

setInterval(incrementTimeMachine, 1000);

startNotificationMonitoring();

app.use(express.json());  
app.use('/api/auth', authRoutes);
app.use('/api', noteRoutes);
app.use('/api', pomsRoutes);
app.use('/api', eventRoutes);
app.use('/api', activityRoutes);
app.use('/api', registerRoutes);
app.use('/api', accountRoutes);
app.use('/api', timeMachineRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(express.static(path.join(__dirname, 'frontend/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/frontend/dist', 'index.html'));
});


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
