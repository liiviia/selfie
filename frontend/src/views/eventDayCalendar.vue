<template>
  <div>
    <h2>Eventi, Attività e Pomodori per {{ formatDate(queryDate) }}</h2>
    <div class="button-container">
      <button @click="navigateToAddEvent">Aggiungi Evento</button>
      <button @click="navigateToAddActivity">Aggiungi Attività</button>
      <button @click="navigateToAddPomodoro">Aggiungi Pomodoro</button>
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

    <div v-if="pomodoros.length > 0">
      <h3>Pomodori:</h3>
      <div v-for="pomodoro in pomodoros" :key="pomodoro._id">
        <h4>Pomodoro Sessione</h4>
        <p>Data: {{ formatDate(pomodoro.giorno) }}</p>
        <p>Tempo di studio: {{ pomodoro.tempoStudio }} minuti</p>
        <p>Tempo di pausa: {{ pomodoro.tempoPausa }} minuti</p>
        <p>Cicli: {{ pomodoro.ripetizioni }}</p>
        <!--<p v-if="pomodoro.remainingTime">Tempo rimanente: {{ Math.floor(pomodoro.remainingTime / 60) }}:{{ pomodoro.remainingTime % 60 }}</p>
        <p v-if="pomodoro.studyCycles !== undefined">Cicli rimanenti: {{ pomodoro.studyCycles }}</p>-->
      </div>
    </div>

     <div v-if="incompleteSessions.length > 0">
      <h4>Sessioni Pomodoro Incomplete:</h4>
      <div v-for="session in incompleteSessions" :key="session._id">
        <p>Data: {{ formatDate(session.giorno) }}</p>
        <p>Tempo rimanente: {{ Math.floor(session.remainingTime / 60) }}:{{ session.remainingTime % 60 }}</p>
        <p>Cicli rimanenti: {{ session.studyCycles }}</p>
         <button @click="resumePomodoro(session)" class="action-button">Riprendi Sessione</button>
         <button @click="discardPomodoro(session)" class="action-button">
          <span class="trash-icon">🗑️</span>Scarta
         </button> 
      </div>
    </div>

    <div v-if="events.length === 0 && activities.length === 0 && pomodoros.length === 0">
      <p>Nessun evento o attività o pomodoro per questa data.</p>
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
    const pomodoros = ref([]); 
    const incompleteSessions = ref([]);
    const queryDate = computed(() => route.query.date);

    const navigateToAddEvent = () => {
      router.push({ path: '/addEvent', query: { date: queryDate.value } });
    };

    const navigateToAddActivity = () => {
      router.push({ path: '/addActivities', query: { date: queryDate.value } });
    };

    const navigateToAddPomodoro = () => {
      router.push({ path: '/pomodoroTempo', query: { date: queryDate.value } });
    };

    const fetchEvents = async () => {
      try {
        const author = route.query.author;
        const date = route.query.date;
        // mi serve per il pomodoro
        const username = route.query.username || author;

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

        const pomodoroResponse = await axios.get('/api/poms/by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username, date }
        });

        console.log('Pomodori recuperati:', pomodoroResponse.data);

        pomodoros.value = Array.isArray(pomodoroResponse.data) ? pomodoroResponse.data : [pomodoroResponse.data];
        console.log('Fetched pomodoros:', pomodoros.value);

      } catch (error) {
        console.error('Errore nel recupero degli eventi, delle attività e dei pomodori:', error);
      }
    };

    const fetchIncompleteSessions = async () => {
      console.log("fetchIncompleteSessions chiamata");
      const token = sessionStorage.getItem('token');
      const username = localStorage.getItem('username');

      try {
        const response = await axios.get('/api/poms/incomplete', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username }
        });
        
      incompleteSessions.value = (Array.isArray(response.data) ? response.data : [response.data])
        .filter(session => session.studyCycles > 0);
        
      } catch (error) {
        console.error('Errore nel recupero delle sessioni incomplete:', error);
      }
    };

    const resumePomodoro = (session) => {

      router.push({
        path: '/pomodoroTempo',
        query: {
          date:  new Date(session.giorno).toISOString(),
          remainingTime: session.remainingTime,
          studyCycles: session.studyCycles,
          isStudyPhase: session.isStudyPhase,
          tempoStudio: session.tempoStudio,
          tempoPausa: session.tempoPausa,
          ripetizioni: session.ripetizioni,
        },
      });
    };

    const discardPomodoro = async (session) => {
      const token = sessionStorage.getItem('token');
      try {
        await axios.delete(`/api/pomRemove/${session._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
        incompleteSessions.value = incompleteSessions.value.filter(s => s._id !== session._id);
        console.log('Sessione Pomodoro scartata.');
      } catch (error) {
        console.error('Errore nello scartare la sessione pomodoro:', error.response?.data || error);
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

    onMounted(() => {
      fetchEvents();
      fetchIncompleteSessions();
    });

    return {
      events,
      activities,
      pomodoros, 
      incompleteSessions, 
      formatDate,
      queryDate,
      navigateToAddEvent,
      navigateToAddActivity,
      navigateToAddPomodoro, 
      resumePomodoro, 
      discardPomodoro,
    };
  }
};
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

button {
  margin-right: 10px;
  margin-bottom: 10px; 
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.trash-icon {
  margin-right: 5px; 
  font-size: 1.2em; 
}

button:hover {
  background-color: #45a049;
}

</style>
