const socketIo = require('socket.io');
let io;

const initializeWebSocket = (server) => {
     io = socketIo(server, {
        cors: {
          origin: 'http://localhost:8080', 
          methods: ['GET', 'POST'],
          allowedHeaders: ['Content-Type'],
          credentials: true,
        },
      });


  io.on('connection', (socket) => {

  

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
