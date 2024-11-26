const socketIo = require('socket.io');
let io;

const initializeWebSocket = (server) => {
     io = socketIo(server, {
        cors: {
          origin: 'http://http://site232432.tw.cs.unibo.it:8000', 
          methods: ['GET', 'POST'],
          allowedHeaders: ['Content-Type'],
          credentials: true,
        },
      });


      console.log("web scoket inizializzato");

  io.on('connection', (socket) => {
  console.log('Un client si è connesso');

  

  socket.on('disconnect', () => {
    console.log('Un client si è disconnesso');
  });
});
};

const sendAlertNotification = (title, date, startTime, userNome) => {
  if (io) {
    io.emit('alert', {
      title,
      date,
      startTime,
      userNome,
    });
    console.log('Alert inviato:', title);
  } else {
    console.error('Socket.io non è inizializzato');
  }
};

module.exports = {
  initializeWebSocket,
  sendAlertNotification,
};