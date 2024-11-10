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

const { scheduleEmailReminders } = require('./cronTask'); 
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const port = 3000;

connectDB();

let timeMachineDate = new Date(); 
module.exports = { timeMachineDate };


app.use(cors());
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

//app.use(express.static(path.join(__dirname, 'frontend/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/frontend/dist', 'index.html'));
});

scheduleEmailReminders(); 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
