<template>
    <div>
      <h2>Eventi e Attività per {{ formatDate(queryDate) }}</h2>
      <div class="button-container">
      <button @click="navigateToAddEvent">Aggiungi Evento</button>
      <button @click="navigateToAddActivity">Aggiungi Attività</button>
    </div>
      <div v-if="events.length > 0">
        <h3>Eventi:</h3>
        <div v-for="event in events" :key="event._id">
          <h4>{{ event.title }}</h4>
          <p>Data: {{ formatDate(event.date) }}</p>
          <p>Descrizione: {{ event.description }}</p>
        </div>
      </div>
      <div v-if="activities.length > 0">
        <h3>Attività:</h3>
        <div v-for="activity in activities" :key="activity._id">
          <h4>{{ activity.title }}</h4>
          <p>Data: {{ formatDate(activity.deadline || activity.date) }}</p>
          <p>Descrizione: {{ activity.description }}</p>
        </div>
      </div>
      <div v-if="events.length === 0 && activities.length === 0">
        <p>Nessun evento o attività per questa data.</p>

      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
      const events = ref([]);
      const activities = ref([]);
      const queryDate = computed(() => route.query.date);


      const navigateToAddEvent = () => {
        router.push({ path: '/addEvent', query: { date: queryDate.value } });
      };

      const navigateToAddActivity = () => {
        router.push({ path: '/addActivities', query: { date: queryDate.value } });
      };
  
      const fetchEvents = async () => {
    try {
      const { author, date } = route.query;
      const token = sessionStorage.getItem('token');
      console.log('Fetching events for:', author, date);
      const response = await axios.get('/api/events/by-date', {
        headers: { Authorization: `Bearer ${token}` },
        params: { author, date }
      });
      events.value = Array.isArray(response.data) ? response.data : [response.data];
      console.log('Fetched events:', events.value);
  
      const activityResponse = await axios.get('/api/activities/by-date', {
        headers: { Authorization: `Bearer ${token}` },
        params: { author, date }
      });
      activities.value = Array.isArray(activityResponse.data) ? activityResponse.data : [activityResponse.data];
      console.log('Fetched activities:', activities.value);
  
      activities.value.forEach(activity => {
        if (activity.deadline) {
          const parsedDate = new Date(activity.deadline);
          if (isNaN(parsedDate)) {
            console.error('Data non valida per l\'attività:', activity);
          } else {
            activity.date = parsedDate; 
          }
        } else {
          console.error('Attività senza data di scadenza:', activity);
        }
      });
    } catch (error) {
      console.error('Errore nel recupero degli eventi e delle attività:', error);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Data non disponibile';
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleDateString('it-IT', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) 
      : 'Data non valida';
  };
  
      onMounted(fetchEvents);
  
      return { events,activities, formatDate, queryDate ,navigateToAddEvent, navigateToAddActivity};
    }
  }
  </script>



<style scoped>
.button-container {
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

</style>