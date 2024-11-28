const express = require('express');
const app = express();

const sendSseMessage = (data) => {
    clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  };
  
  let clients = []; // Per gestire i client connessi
  
  // Endpoint SSE
  app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Modifica per la produzione
  
    console.log('Client connesso per SSE');
  
    // Aggiungi il client all'elenco
    clients.push(res);
  
    // Rimuovi il client quando la connessione si chiude
    req.on('close', () => {
      console.log('Connessione SSE chiusa');
      clients = clients.filter((client) => client !== res);
    });
  });


  module.exports = {
    sendSseMessage
  };