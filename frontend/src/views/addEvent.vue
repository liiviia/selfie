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
  margin: 50px auto;
  padding: 30px;
  background-color: #15172b;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* ombreggiatura */
  transition: transform 0.3s ease; /* transizione */
  box-sizing: border-box;
}

.event-form:hover {
  transform: translateY(-5px); /* animazione al passaggio */
}

.event-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
}

.event-form div {
  margin-bottom: 20px;
}

.event-form label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  display: block;
}

.event-form input[type="text"],
.event-form input[type="date"],
.event-form input[type="time"],
.event-form input[type="number"],
.event-form textarea,
.event-form select {
  padding: 12px;
  border: 2px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.event-form input:focus,
.event-form textarea:focus,
.event-form select:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25); /* effetto focus */
  outline: none;
}

.event-form textarea {
  height: 120px;
  resize: none;
}

.event-form button {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease, transform 0.2s;
}

.event-form button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.event-form p {
  text-align: center;
  margin-top: 20px;
  color: #28a745;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}

.event-form input,
.event-form textarea,
.event-form button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /*  effetto ombra per gli input e il pulsante */
}

.event-form div {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-home-link {
  color: #0016db;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.3s ease;
  text-align: left;
}

</style>
