const socketIo = require('socket.io');
let io;

const initializeWebSocket = (server) => {
     io = socketIo(server, {
        cors: {
          origin: 'http://site232432.tw.cs.unibo.it:8000', 
          methods: ['GET', 'POST'],
          allowedHeaders: ['Content-Type'],
          credentials: true,
        },
      });

  console.log('WebSocket server inizializzato e in ascolto sulla porta 8000');
  io.on('connection', (socket) => {
      console.log("giusto");

  socket.on('disconnect', () => {
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
  } else {
    console.error('Socket.io non è inizializzato');
  }
};

module.exports = {
  initializeWebSocket,
  sendAlertNotification,
};
