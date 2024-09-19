<template>
  <div>
    <h1>Aggiungi Evento</h1>
    <form @submit.prevent="aggiungiEvento">
      <div>
        <label for="title">Titolo:</label>
        <input type="text" id="title" v-model="newEvent.title" required>
      </div>

      <div>
        <label for="description">Descrizione:</label>
        <textarea id="description" v-model="newEvent.description"></textarea>
      </div>

      <div>
        <label for="date">Data:</label>
        <input type="date" id="date" v-model="newEvent.date" required>
      </div>

      <div>
        <label for="time">Ora:</label>
        <input type="time" id="time" v-model="newEvent.time" required>
      </div>

      <div>
        <label for="duration">Durata (minuti):</label>
        <input type="number" id="duration" v-model="newEvent.duration" required>
      </div>

      <div>
        <label for="repeatFrequency">Frequenza di ripetizione:</label>
        <select id="repeatFrequency" v-model="newEvent.repeatFrequency">
          <option value="">Nessuna</option>
          <option value="daily">Giornaliera</option>
          <option value="weekly">Settimanale</option>
          <option value="monthly">Mensile</option>
          <option value="custom">Personalizzata</option>
        </select>
      </div>

      <div v-if="newEvent.repeatFrequency === 'custom'">
        <label for="daysOfWeek">Giorni della settimana:</label>
        <input type="text" id="daysOfWeek" v-model="newEvent.daysOfWeek" placeholder="es.: monday,wednesday">
      </div>

      <div>
        <label for="dayOfMonth">Giorno del mese:</label>
        <input type="number" id="dayOfMonth" v-model="newEvent.dayOfMonth">
      </div>

      <div>
        <label for="repeatCount">Numero di ripetizioni:</label>
        <input type="number" id="repeatCount" v-model="newEvent.repeatCount">
      </div>

      <div>
        <label for="repeatUntil">Ripeti fino al:</label>
        <input type="date" id="repeatUntil" v-model="newEvent.repeatUntil">
      </div>

      <div>
        <label for="location">Luogo:</label>
        <input type="text" id="location" v-model="newEvent.location">
      </div>

      <div>
        <label for="notificationMechanism">Meccanismo di notifica:</label>
        <input type="text" id="notificationMechanism" v-model="newEvent.notificationMechanism" placeholder="es.: OS, Email">
      </div>

      <div>
        <label for="notificationAdvanceMinutes">Notifica minuti prima:</label>
        <input type="number" id="notificationAdvanceMinutes" v-model="newEvent.notificationAdvanceMinutes">
      </div>

      <div>
        <label for="notificationAdvanceHours">Notifica ore prima:</label>
        <input type="number" id="notificationAdvanceHours" v-model="newEvent.notificationAdvanceHours">
      </div>

      <div>
        <label for="notificationAdvanceDays">Notifica giorni prima:</label>
        <input type="number" id="notificationAdvanceDays" v-model="newEvent.notificationAdvanceDays">
      </div>

      <div>
        <label for="notificationRepeat">Ripeti notifica:</label>
        <input type="text" id="notificationRepeat" v-model="newEvent.notificationRepeat" placeholder="es.: everyMinute, everyHour, untilResponse">
      </div>

      <button type="submit">Aggiungi Evento</button>
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
form {
  margin: 20px;
}

input, textarea, select {
  margin-bottom: 10px;
  display: block;
}
</style>
