<template>
   <div>
    <h2 class="main-title">Eventi, Attività e Pomodori per {{ formatDate(queryDate) }}</h2>
     <div class="section events-section full-width">
      <h3>I TUOI EVENTI:</h3>
      <div v-if="events.length > 0">
        <div v-for="event in events" :key="event._id" class="item-container">
          <h4><span style="font-size: 0.9em;">Titolo:</span> {{ event.title }}</h4>
          <p>Data: {{ formatDate(event.date) }}</p>
          <p>Descrizione: {{ event.description }}</p>
          <button @click="confirmDeleteEvent(event._id)" class="delete-btn">🗑️</button>
        </div>
      </div>
      <p v-else>Nessun evento per questa data.</p>
      <div class="button-container">
        <button class="fixed-button" @click="navigateToAddEvent" style="background:#f4a460;">
          Aggiungi evento
        </button>
      </div>
    </div>

    <div class="content-container">
      <div class="section activities-section">
        <h3>LE TUE ATTIVITÀ:</h3>
        <div v-if="activities.length > 0">
          <div v-for="activity in activities" :key="activity._id" class="item-container"
          :class="{ completed: activity.completed }">
            <h4><span style="font-size: 0.9em;">Titolo:</span> {{ activity.title }}</h4>
            <p>Data: {{ formatDate(activity.deadline || activity.date) }}</p>
            <p>Descrizione: {{ activity.description }}</p>
            <p v-if="activity.type === 'gruppo'" style="color: #FF6347;">
              Attività di gruppo creata da: {{ activity.author }}<br>
              Gruppo composto da: {{ activity.participants.join(', ') }}
            </p>
            <button v-if="!activity.completed" @click="markAsCompleted(activity)" class="complete-btn">Completata</button>
            <button @click="confirmDeleteActivity(activity._id)" class="delete-btn">🗑️</button>
          </div>
        </div>
        <p v-else>Nessuna attività per questa data.</p>
        <div class="button-container">
          <button class="fixed-button" @click="navigateToAddActivity" style="background:#f4a460;">
            Aggiungi attivita
          </button>
        </div>
      </div>
      
      
      <div class="content-container">
       <div class="section overdue-activities-section">
        <h3>ATTIVITÀ INCOMPLETE:</h3>
        <div v-if="filteredOverdueActivities.length > 0">
          <div v-for="activity in filteredOverdueActivities" :key="activity._id" class="item-container overdue">
            <h4>Titolo: {{ activity.title }}</h4>
            <p>Data scadenza: {{ formatDate(activity.deadline) }}</p>
            <p>Descrizione: {{ activity.description }}</p>
            <button @click="discardActivity(activity._id)" class="delete-btn">Scarta</button>
          </div>
        </div>
        <p v-else>Nessuna attività incompleta trovata.</p>
      </div>
    </div>
  </div>

    <div class="content-container">
  <div class="section pomodoros-section">
        <h3>I TUOI POMODORI:</h3>
        <div v-if="pomodoros.length > 0">
          <div v-for="pomodoro in pomodoros" :key="pomodoro._id" class="item-container">
            <h4>Pomodoro Sessione</h4>
            <p>Data: {{ formatDate(pomodoro.giorno) }}</p>
            <p>Tempo di studio: {{ pomodoro.tempoStudio }} minuti</p>
            <p>Tempo di pausa: {{ pomodoro.tempoPausa }} minuti</p>
            <p>Ripetizioni: {{ pomodoro.ripetizioni }}</p>
            <button @click="confirmDeletePomodoro(pomodoro._id)" class="delete-btn">🗑️</button>
          </div>
        </div>
        <p v-else>Nessun pomodoro per questa data.</p>
        <div class="button-container">
          <button class="fixed-button" @click="navigateToAddPomodoro" style="background:#f4a460;">
            Aggiungi pomodoro
            </button>
        </div>
      </div>


      <div class="section pomodorosScaduti-section">
        <h3>I TUOI POMODORI INCOMPLETI</h3>
      <div v-if="incompleteSessions.length > 0">
      <div v-for="session in incompleteSessions" :key="session._id" class="item-container">
        <p>Data: {{ formatDate(session.giorno) }}</p>
        <p>Tempo rimanente: {{ Math.floor(session.remainingTime / 60) }}:{{ session.remainingTime % 60 }}</p>
        <p>Cicli rimanenti: {{ session.studyCycles }}</p>
         <button @click="resumePomodoro(session)" class="action-button">Riprendi Sessione</button>
         <button @click="discardPomodoro(session)" class="action-button">
          <span class="trash-icon">🗑️ </span>Scarta
         </button> 
      </div>
    </div>
    <p v-else>nessun pomodoro da portare a termine</p>
  </div>

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
    const overdueActivities = ref([]); 
    const queryDate = computed(() => route.query.date);

    const confirmDeleteActivity = (id) => {
      if (confirm("Sicuro di voler eliminare questa Attività?")) {
        deleteActivities(id); 
      }
    };
    const navigateToAddActivity = () => {
      router.push({ path: '/addActivities', query: { date: queryDate.value } });
    };
    const navigateToAddEvent = () => {
      router.push({ path: '/addEvent', query: { date: queryDate.value } });
    };
    const navigateToAddPomodoro = () => {
      router.push({ path: '/pomodoroTempo', query: { date: queryDate.value } });
    };

    const deleteActivities = async (id) => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        await axios.delete(`/api/activitiesRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params: { username: username } 
        });
        console.log('Attività eliminata');
        fetchEvents(); 
      } catch (error) {
        console.error('Errore nell\'eliminazione della attività:', error);
      }
    };

    const confirmDeleteEvent = (id) => {
      if (confirm("Sicuro di voler eliminare questo Evento?")) {
        deleteEvents(id); 
      }
    };

    const deleteEvents = async (id) => {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`/api/eventsRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Evento eliminato');
        fetchEvents(); 
      } catch (error) {
        console.error('Errore nell\'eliminazione di evento:', error);
      }
    };

    const confirmDeletePomodoro = (id) => {
      if (confirm("Sicuro di voler eliminare questa sessione Pomodoro?")) {
        deletePomodoro(id); 
      }
    };

    const deletePomodoro = async (id) => {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`/api/pomRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Sessione Pomodoro eliminata');
        fetchPoms(); 
      } catch (error) {
        console.error('Errore nell\'eliminazione della sessione:', error);
      }
    };


    const fetchActivities = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const author = localStorage.getItem('username'); // Recupera l'autore dal localStorage
    console.log('Fetching activities for:', { date: queryDate.value, author }); // Debug
    const response = await axios.get('/api/activities/by-date', {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: queryDate.value, author }, // Passa entrambi i parametri
    });
    activities.value = response.data;
  } catch (error) {
    console.error('Errore nel recupero delle attività:', error);
  }
};



     const fetchPoms = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/poms', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filtra solo le sessioni future o presenti
        this.poms = response.data.filter(pom => {
          const sessionDate = new Date(pom.giorno);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate >= today;
        });

        console.log('Sessioni Pomodoro recuperate e filtrate:', this.poms);
      } catch (error) {
        console.error('Errore durante il recupero delle sessioni Pomodoro:', error);
      }
    }


    const fetchEvents = async () => {
      try {
        const author = route.query.author;
        const date = route.query.date;
        const username = route.query.username || author;

        const token = sessionStorage.getItem('token');
        console.log('Fetching events for:', author, date);

        const response = await axios.get('/api/events/by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: { author, date }
        });
        events.value = Array.isArray(response.data) ? response.data : [response.data];
        console.log('Fetched events:', events.value);

/*      const activityResponse = await axios.get('/api/activities/by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: { author, date }
        });
        // Filtra le attività completate 
        const allActivities = Array.isArray(activityResponse.data) ? activityResponse.data : [activityResponse.data];
        activities.value = allActivities;
        console.log('Fetched activities:', activities.value);
*/
        const pomodoroResponse = await axios.get('/api/poms/by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username, date }
        });
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
        
        incompleteSessions.value = (Array.isArray(response.data) ? response.data : [response.data]).filter(session => {
        return (
          session.studyCycles > 0 && 
          session.remainingTime > 0 &&
          session.tempoStudio && 
          session.tempoPausa 
      );
    });

      } catch (error) {
        console.error('Errore nel recupero delle sessioni incomplete:', error);
      }
    };

    const resumePomodoro = (session) => {
    const plainSession = JSON.parse(JSON.stringify(session));

    console.log("Sessione passata a pomodoroTempo:", plainSession);

    router.push({
      path: '/pomodoroTempo',
      query: {
        date: new Date(plainSession.giorno).toISOString(),
        remainingTime: plainSession.remainingTime,
        studyCycles: plainSession.studyCycles,
        isStudyPhase: plainSession.isStudyPhase,
        tempoStudio: plainSession.tempoStudio, 
        tempoPausa: plainSession.tempoPausa,   
        ripetizioni: plainSession.ripetizioni, 
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


    const fetchOverdueActivities = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/activities/overdue', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username },
        });
        overdueActivities.value = response.data;
      } catch (error) {
        console.error('Errore nel recupero delle attività scadute:', error);
      }
    };

    const filteredOverdueActivities = computed(() =>
      overdueActivities.value.filter(activity => activity.title && activity.deadline)
    );


    /*const markActivityComplete = async (activity) => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');

        const response = await axios.post('/api/activities/mark-complete', {
          id: activity._id,
          username,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });

      console.log('Attività completata:', response.data);

      activities.value = activities.value.filter(a => a._id !== activity._id);
      } catch (error) {
      console.error('Errore nel segnare l\'attività come completata:', error);
    }
  };*/

      const markAsCompleted = async (activity) => {
      try {
        const token = sessionStorage.getItem('token');
        await axios.put(`/api/activities/${activity._id}`, { completed: true }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        activity.completed = true;
        // Aggiorna la lista localmente
        activities.value = activities.value.filter(a => a._id !== activity._id);
        overdueActivities.value = overdueActivities.value.filter(a => a._id !== activity._id);
      } catch (error) {
        console.error('Errore nel completare l\'attività:', error);
      }
    };

    const discardActivity = async (id) => {
  try {
    const token = sessionStorage.getItem('token');
    console.log('Discarding activity with ID:', id); 
    await axios.delete(`/api/activitiesRemove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    overdueActivities.value = overdueActivities.value.filter(a => a._id !== id);
  } catch (error) {
    console.error('Errore nello scartare l\'attività:', error);
  }
};



    onMounted(() => {
      fetchEvents();
      fetchActivities();
      fetchOverdueActivities();
      fetchIncompleteSessions();
    });

    return {
      events,
      activities,
      pomodoros, 
      incompleteSessions, 
      overdueActivities,
      formatDate,
      queryDate,
      navigateToAddEvent,
      navigateToAddActivity,
      navigateToAddPomodoro, 
      resumePomodoro, 
      discardPomodoro,
      confirmDeleteActivity,
      confirmDeleteEvent,
      confirmDeletePomodoro,
      //markActivityComplete ,
      markAsCompleted,
      filteredOverdueActivities,
      discardActivity
    };
  }
};


</script>

<style scoped>
.full-width {
  width: 100%;
  margin-bottom: 20px;
  background-color: rgba(230, 247, 255, 0.8);
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
}


.center-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.content-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 20px;
}

.button-container {
  margin-top: auto; 
  margin-bottom: 10px; 
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

.activities-section {
  flex: 1.5; 
  background-color: #f9f9f9;
}

.events-section {
  flex: 1.5; 
  background-color: #e6f7ff;
}

.pomodoros-section {
  flex: 1.5; 
  background-color: #ffe6e6;
}

.section {
  margin-right: 100px;
  min-width: 500px;
  flex: 1.5; 
  padding: 25px;
  border: 1px solid #ddd; 
  border-radius: 10px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
  background-color: rgba(255, 255, 255, 0.8); 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
}

.section:hover {
  transform: scale(1.02); 
}

.activities-section {
  background-color: rgba(249, 249, 249, 0.8); 
}

.events-section {
  background-color: rgba(230, 247, 255, 0.8); 
}

.pomodoros-section {
  background-color: rgba(255, 230, 230, 0.8);
}

hr {
  border: 0; 
  height: 1px; 
  background-color: #ddd; 
  margin: 10px 0; 
}
.item-container {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd; 
  border-radius: 8px; 
  padding: 15px; 
  margin-bottom: 15px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative; 
}

.delete-btn {
  position: absolute; 
  bottom: 10px;
  right: 10px; 
  background: none;
  border: none; 
  cursor: pointer; 
  font-size: 1.2em;
  color: #e74c3c; 
}

.delete-btn:hover {
  color: #c0392b; 
}


@media (max-width: 768px) {
  .content-container {
    flex-direction: column; 
    margin-left: 0; 
  }

  .section {
    min-width: auto; 
    margin-right: 0; 
    margin-bottom: 20px; 
  }
  .main-title {
  margin-top: 20px; 
}
}

.item-container {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd; 
  border-radius: 8px; 
  padding: 15px; 
  margin-bottom: 15px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative; 
  transition: border-color 0.3s ease; 
}

.item-container.overdue {
  border-color: red;
  background-color: #ffe6e6;
}

.item-container.incpom {
  border-color: red;
  background-color: #ffe6e6;
}


.item-container.completed {
  border-color: green;
  box-shadow: 0 2px 8px rgba(0, 128, 0, 0.5); 
}

.complete-btn {
  background-color: #28a745; 
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.complete-btn:hover {
  background-color: #218838; 
}

.complete-btn:before {
  content: '✔️ '; 
  margin-right: 8px; 
}

</style>