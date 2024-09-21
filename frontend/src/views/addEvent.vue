<template>
  <div class="event-form">
    <h1>Aggiungi Evento</h1>
    <form @submit.prevent="aggiungiEvento">
      <div class="form-group">
        <label for="title">Titolo:</label>
        <input type="text" id="title" v-model="newEvent.title" required>
      </div>

      <div class="form-group">
        <label for="description">Descrizione:</label>
        <textarea id="description" v-model="newEvent.description"></textarea>
      </div>

      <div class="form-group">
        <label for="date">Data:</label>
        <input type="date" id="date" v-model="newEvent.date" required>
      </div>

      <div class="form-group">
        <label for="time">Ora:</label>
        <input type="time" id="time" v-model="newEvent.time" required>
      </div>

      <div class="form-group">
        <label for="duration">Durata (minuti):</label>
        <input type="number" id="duration" v-model="newEvent.duration" required>
      </div>

      <div class="form-group">
        <label for="repeatFrequency">Frequenza di ripetizione:</label>
        <select id="repeatFrequency" v-model="newEvent.repeatFrequency">
          <option value="">Nessuna</option>
          <option value="daily">Giornaliera</option>
          <option value="weekly">Settimanale</option>
          <option value="monthly">Mensile</option>
          <option value="custom">Personalizzata</option>
        </select>
      </div>

      <div v-if="newEvent.repeatFrequency === 'custom'" class="form-group">
        <label for="daysOfWeek">Giorni della settimana:</label>
        <input type="text" id="daysOfWeek" v-model="newEvent.daysOfWeek" placeholder="es.: monday,wednesday">
      </div>

      <div class="form-group">
        <label for="dayOfMonth">Giorno del mese:</label>
        <input type="number" id="dayOfMonth" v-model="newEvent.dayOfMonth">
      </div>

      <div class="form-group">
        <label for="repeatCount">Numero di ripetizioni:</label>
        <input type="number" id="repeatCount" v-model="newEvent.repeatCount">
      </div>

      <div class="form-group">
        <label for="repeatUntil">Ripeti fino al:</label>
        <input type="date" id="repeatUntil" v-model="newEvent.repeatUntil">
      </div>

      <div class="form-group">
        <label for="location">Luogo:</label>
        <input type="text" id="location" v-model="newEvent.location">
      </div>

      <div class="form-group">
        <label for="notificationMechanism">Meccanismo di notifica:</label>
        <input type="text" id="notificationMechanism" v-model="newEvent.notificationMechanism" placeholder="es.: OS, Email">
      </div>

      <div class="form-group">
        <label for="notificationAdvanceMinutes">Notifica minuti prima:</label>
        <input type="number" id="notificationAdvanceMinutes" v-model="newEvent.notificationAdvanceMinutes">
      </div>

      <div class="form-group">
        <label for="notificationAdvanceHours">Notifica ore prima:</label>
        <input type="number" id="notificationAdvanceHours" v-model="newEvent.notificationAdvanceHours">
      </div>

      <div class="form-group">
        <label for="notificationAdvanceDays">Notifica giorni prima:</label>
        <input type="number" id="notificationAdvanceDays" v-model="newEvent.notificationAdvanceDays">
      </div>

      <div class="form-group">
        <label for="notificationRepeat">Ripeti notifica:</label>
        <input type="text" id="notificationRepeat" v-model="newEvent.notificationRepeat" placeholder="es.: everyMinute, everyHour, untilResponse">
      </div>

      <button type="submit" class="submit-button">Aggiungi Evento</button>
    </form>
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
        time: '',
        duration: '',
        repeatFrequency: '',
        daysOfWeek: '',
        dayOfMonth: '',
        repeatCount: '',
        repeatUntil: '',
        location: '',
        author: localStorage.getItem('username') || 'Guest',
        notificationMechanism: '',
        notificationAdvanceMinutes: '',
        notificationAdvanceHours: '',
        notificationAdvanceDays: '',
        notificationRepeat: ''
      }
    };
  },
  methods: {
    async aggiungiEvento() {
      try {
        const response = await axios.post('/api/events', this.newEvent);
        console.log('Evento aggiunto:', response.data);
        this.newEvent = {
          title: '',
          description: '',
          date: '',
          time: '',
          duration: '',
          repeatFrequency: '',
          daysOfWeek: '',
          dayOfMonth: '',
          repeatCount: '',
          repeatUntil: '',
          location: '',
          author: this.newEvent.username,
          notificationMechanism: '',
          notificationAdvanceMinutes: '',
          notificationAdvanceHours: '',
          notificationAdvanceDays: '',
          notificationRepeat: ''
        };
      } catch (error) {
        console.error('Errore durante l\'aggiunta dell\'evento:', error);
      }
    }
  }
};
</script>

<style scoped>
.event-form {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
}

input:focus, textarea:focus, select:focus {
  border-color: #80bdff;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
