<template>
    <div>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  
  export default {
    data() {
      return {
        alerts: [], 
        socket: null,
      };
    },
    created() {
      this.socket = io('http://site232432.tw.cs.unibo.it:8000', {
  console.log("web socket all'indirizzo", this.socket);   
     transports: ['websocket'], 
      });
  
      this.socket.on('connect_error', (error) => {
        
        console.log('Errore di connessione:', error);
      });
  
      this.socket.on('alert', (data) => {
        console.log('Alert ricevuto:', data);
  
        const loggedInUser = localStorage.getItem('username'); 
  
        if (data.userNome === loggedInUser) {
          alert(`TITOLO: ${data.title}\nOra di inizio: ${data.startTime}\nDi utente: ${data.userNome}`);
          this.alerts.push(data); 
        }
      });
  
      this.socket.on('connect', () => {
        console.log('Connesso al server WebSocket');
      });
    },
    unmounted() {
      if (this.socket) {
 this.socket.close();
        this.socket.disconnect();
      }
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  
