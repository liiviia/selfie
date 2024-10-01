<template>
  <div class="activity-list">
    <h1>Lista delle Attività</h1>
    
    <ul v-if="activities.length > 0" class="activity-items">
      <li v-for="(activity, index) in activities" :key="index" class="activity-item">
        <h3>{{ activity.title }}</h3>
        <p>{{ activity.description }}</p>
        <p><strong>Scadenza:</strong> {{ formatDate(activity.deadline) }}</p>
        <p><strong>Autore:</strong> {{ activity.author }}</p>
        <p><strong>Completata:</strong> {{ activity.completed ? 'Sì' : 'No' }}</p>
      </li>
    </ul>
    
    <p v-else class="no-activities">Non ci sono attività da visualizzare.</p>
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
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username'); 
        const response = await axios.get('/api/activitiesGET', {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params: { username: username }
        });
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
.activity-list {
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

.activity-items {
  list-style-type: none;
  padding: 0;
}

.activity-item {
  padding: 15px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: box-shadow 0.3s;
}

.activity-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.no-activities {
  text-align: center;
  color: #6c757d;
}
</style>
