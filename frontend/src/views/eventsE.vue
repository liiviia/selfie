<template>
  <div>
    <h1>Lista Eventi</h1>
    <ul>
      <li v-for="event in events" :key="event._id">
        <h2>{{ event.title }}</h2>
        <p>{{ event.description }}</p>
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
        const response = await axios.get('/api/events');
        this.events = response.data;
      } catch (error) {
        console.error('Errore nel recupero degli eventi:', error);
      }
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    }
  },
  mounted() {
    this.fetchEvents();
  }
};
</script>

<style scoped>
</style>
