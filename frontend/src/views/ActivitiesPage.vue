<template>
    <div>
      <h1>Lista delle Attività</h1>
      
      <ul v-if="activities.length > 0">
        <li v-for="(activity, index) in activities" :key="index">
          <h3>{{ activity.title }}</h3>
          <p>{{ activity.description }}</p>
          <p>Scadenza: {{ formatDate(activity.deadline) }}</p>
          <p>Autore: {{ activity.author }}</p>
          <p>Completata: {{ activity.completed ? 'Sì' : 'No' }}</p>
        </li>
      </ul>
      
      <p v-else>Non ci sono attività da visualizzare.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        activities: []
      };
    },
    methods: {
      async fetchActivities() {
        try {
          const response = await axios.get('/api/activities');
          this.activities = response.data;
        } catch (error) {
          console.error('Errore durante il recupero delle attività:', error);
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      }
    },
    mounted() {
      this.fetchActivities();
    }
  };
  </script>
  
  <style scoped>
  /* Aggiungi eventuali stili qui */
  </style>
  