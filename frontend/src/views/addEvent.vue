<template>
  <div class="event-form">
    <h2>Crea un Nuovo Evento</h2>
    <form @submit.prevent="createEvent">
      <div>
        <label for="title">Titolo:</label>
        <input type="text" v-model="newEvent.title" required />
      </div>
      <div>
        <label for="description">Descrizione:</label>
        <textarea v-model="newEvent.description"></textarea>
      </div>
      <div>
        <label for="date">Data:</label>
        <input type="date" v-model="newEvent.date" required />
      </div>
      <div>
        <label for="startTime">Ora di Inizio:</label>
        <input type="time" v-model="newEvent.startTime" required />
      </div>
      <div>
        <label for="duration">Durata (minuti):</label>
        <input type="number" v-model="newEvent.duration" required />
      </div>
      <div>
        <label for="location">Luogo:</label>
        <input type="text" v-model="newEvent.location" />
      </div>
      <div>
        <label>È Ripetibile?</label>
        <input type="checkbox" v-model="newEvent.isRecurring" />
      </div>
      <div v-if="newEvent.isRecurring">
        <label for="frequency">Frequenza:</label>
        <select v-model="newEvent.frequency">
          <option value="one-time">Una tantum</option>
          <option value="daily">Giornaliero</option>
          <option value="weekly">Settimanale</option>
          <option value="monthly">Mensile</option>
          <option value="custom">Personalizzato</option>
        </select>
        <div v-if="newEvent.frequency === 'custom'">
          <label for="recurrencePattern">Pattern di Ripetizione:</label>
          <input type="text" v-model="newEvent.recurrencePattern" placeholder="Esempio: ogni martedì" />
        </div>
        <div>
          <label for="numberOfOccurrences">Numero di Ripetizioni:</label>
          <input type="number" v-model="newEvent.numberOfOccurrences" placeholder="Lascia vuoto per ripetere indefinitamente" />
        </div>
      </div>
      <div>
        <label>Meccanismo di Notifica:</label>
        <div>
          <input type="checkbox" value="system" v-model="newEvent.notificationMechanism" /> Sistema
          <input type="checkbox" value="email" v-model="newEvent.notificationMechanism" /> Email
          <input type="checkbox" value="whatsapp" v-model="newEvent.notificationMechanism" /> WhatsApp
          <input type="checkbox" value="alert" v-model="newEvent.notificationMechanism" /> Alert
        </div>
        <div>
          <label for="notificationTime">Tempo di Notifica (minuti prima):</label>
          <input type="number" v-model="newEvent.notificationTime" />
        </div>
        <div>
          <label for="repeatNotification">Ripeti Notifica (minuti):</label>
          <input type="number" v-model="newEvent.repeatNotification" />
        </div>
      </div>
      <div>
        <label for="author">Autore:</label>
        <input type="text" v-model="newEvent.author" required />
      </div>
      <button type="submit">Crea Evento</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newEvent: {
        title: '',
        description: '',
        date: '',
        startTime: '',
        duration: '',
        location: '',
        isRecurring: false,
        frequency: 'one-time',
        recurrencePattern: '',
        numberOfOccurrences: null,
        notificationMechanism: [],
        notificationTime: 0,
        repeatNotification: 0,
        author: localStorage.getItem('username') || 'Guest'
      },
      message: ''
    };
  },
  methods: {
    async createEvent() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post('/api/events', this.newEvent, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Evento creato con successo:', response.data);

        this.newEvent = {
          title: '',
          description: '',
          date: '',
          startTime: '',
          duration: '',
          location: '',
          isRecurring: false,
          frequency: 'one-time',
          recurrencePattern: '',
          numberOfOccurrences: null,
          notificationMechanism: [],
          notificationTime: 0,
          repeatNotification: 0,
          author: localStorage.getItem('username') || 'Guest'
        };

        this.message = 'Evento creato con successo!';
        this.$router.push('/homePrincipale'); 
      } catch (error) {
        this.message = 'Errore durante la creazione dell\'evento: ' + error;
        console.error('Errore:', error);
      }
    }
  }
};
</script>

<style scoped>
.event-form {
  max-width: 600px;
  margin: auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-form h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.event-form div {
  margin-bottom: 15px;
}

.event-form label {
  display: block;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.event-form input[type="text"],
.event-form input[type="date"],
.event-form input[type="time"],
.event-form input[type="number"],
.event-form textarea,
.event-form select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.event-form textarea {
  resize: vertical;
}

.event-form input[type="checkbox"] {
  margin-right: 10px;
}

.event-form button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.event-form button:hover {
  background-color: #45a049;
}

.event-form p {
  text-align: center;
  color: #4caf50;
  font-weight: bold;
}

.event-form input:focus,
.event-form textarea:focus,
.event-form select:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

</style>
