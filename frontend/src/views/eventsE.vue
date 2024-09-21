<template>
  <div>
    <h1>Lista Eventi</h1>
    <ul>
      <li v-for="event in events" :key="event._id">
        <h2>{{ event.title }}</h2>
        <p>{{ event.description }}</p>
        <p><strong>Data:</strong> {{ formatDate(event.date) }}</p>
        <p><strong>Orario:</strong> {{ event.time }}</p>
        <p><strong>Durata:</strong> {{ event.duration }} minuti</p>
        <p><strong>Luogo:</strong> {{ event.location }}</p>
        <p><strong>Ripetizione:</strong> {{ formatRepeat(event) }}</p>
        <p><strong>Autore:</strong> {{ event.author }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: []
    };
  },
  methods: {
    async fetchEvents() {
      try {
        const username = localStorage.getItem('username'); 
        const response = await axios.get('/api/eventsGET', {
          params: { username: username }
        });
        this.events = response.data;
      } catch (error) {
        console.error('Errore nel recupero degli eventi:', error);
      }
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    },
    formatRepeat(event) {
      if (event.repeatFrequency) {
        let frequencyDetails = `${event.repeatFrequency}`;
        if (event.daysOfWeek && event.daysOfWeek.length) {
          frequencyDetails += ` ogni ${event.daysOfWeek.join(', ')}`;
        }
        if (event.dayOfMonth) {
          frequencyDetails += ` ogni ${event.dayOfMonth}° giorno del mese`;
        }
        if (event.repeatUntil) {
          frequencyDetails += ` fino al ${this.formatDate(event.repeatUntil)}`;
        }
        return frequencyDetails;
      }
      return 'Nessuna ripetizione';
    }
  },
  mounted() {
    this.fetchEvents();
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
}
li {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
</style>
