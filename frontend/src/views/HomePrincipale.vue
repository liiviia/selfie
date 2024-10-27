<template>

  <div class="home-principale">
    <div class="container mt-3">
      <div class="row">

        <div class="col-md-6">
          <!-- <div class="d-flex justify-content-center align-items-center">
            
          </div>          
 -->
          <div class="notification-form mt-4">
            <div class="form-group">
              <label for="userSelect">Seleziona utenti per notifica:</label>
              <select id="userSelect" v-model="selectedUsers" multiple class="form-control">
                <option v-for="user in users" :key="user._id" :value="user._id">
                  {{ user.username }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Scrivi il messaggio:</label>
              <textarea id="message" v-model="notificationMessage" placeholder="Scrivi il tuo messaggio qui..."
                class="form-control"></textarea>
            </div>

            <button @click="sendNotifications" class="btn btn-primary">Invia Notifica</button>
          </div>
        </div>


        <div class="col-md-6">
          <div id="carouselExampleIndicators" class="carousel slide mt-4" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3"
                aria-label="Slide 4"></button>
            </div>



            <div class="carousel-inner">


              <div class="carousel-item active">
                <div class="d-block w-100 text-center p-4">
                  <h2>{{ isCurrentDay ? 'Evento di Oggi' : 'Ultimo Evento' }}</h2>
                  <p v-if="noEventsMessage">{{ noEventsMessage }}</p>
                  <p v-else>
                    <strong>Titolo:</strong> {{ lastEventTitle }}<br>
                    <strong>Descrizione:</strong> {{ lastEventDescription }}<br>
                    <strong>Data:</strong> {{ lastEventDate }}
                  </p>
                  <button v-if="!isCurrentDay" class="btn btn-primary mt-3" @click="getCurrentDayEvents">Vedi eventi del
                    giorno corrente</button>
                  <button v-else class="btn btn-secondary mt-3" @click="getLastEvent">Torna all'ultimo evento</button>
                </div>
              </div>



              <div class="carousel-item">
                <div class="d-block w-100 text-center p-4">
                  <h2>{{ isCurrentDayActivity ? 'Attività di Oggi' : 'Ultima Attività' }}</h2>
                  <p v-if="noActivitiesMessage">{{ noActivitiesMessage }}</p>
                  <p v-else>
                    <strong>Titolo:</strong> {{ lastActivityTitle }}<br>
                    <strong>Descrizione:</strong> {{ lastActivityDescription }}<br>
                    <strong>Scadenza:</strong> {{ lastActivityDeadline }}
                  </p>
                  <button v-if="!isCurrentDayActivity" class="btn btn-primary mt-3"
                    @click="getCurrentDayActivities">Vedi attività del giorno corrente</button>
                  <button v-else class="btn btn-secondary mt-3" @click="getLastActivity">Torna all'ultima
                    attività</button>
                </div>
              </div>

              <div class="carousel-item">
                <div class="d-block w-100 text-center p-4">
                  <h2>Ultima Nota</h2>
                  <p v-if="noNotesMessage">{{ noNotesMessage }}</p>
                  <p v-else>
                    <strong>Titolo:</strong> {{ lastNoteHeading }}<br>
                    <strong>Autore:</strong> {{ lastNoteAuthor }}
                  </p>
                </div>
              </div>


              <div class="carousel-item">
                <div class="d-block w-100 text-center p-4">
                  <h2>Ultimo Pomodoro</h2>
                  <p v-if="noPomodorosMessage">{{ noPomodorosMessage }}</p>
                  <p v-else>
                    <strong>tempo studio prefissato:</strong> {{ lastPomodoroTempoStudio }}<br>
                    <strong>tempo pausa prefissato:</strong> {{ lastPomodoroTempoPausa }}<br>
                    <strong>ripetizioni prefissate:</strong> {{ lastPomodoroRipetizioni }}
                  </p>
                </div>
              </div>


            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>



          </div>


          <div id="carouselNotifications" class="carousel slide mt-4" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button v-for="(notification, index) in notifications" :key="index" type="button"
                :data-bs-target="'#carouselNotifications'" :data-bs-slide-to="index" :class="{ active: index === 0 }"
                :aria-current="index === 0 ? 'true' : 'false'" :aria-label="'Slide ' + (index + 1)">
              </button>
            </div>

            <div class="carousel-inner">
              <div v-if="notifications.length === 0" class="carousel-item active">
                <div class="d-block w-100 text-center p-4">
                  <h2>Nessuna Notifica</h2>
                  <p>{{ noNotificationsMessage }}</p>
                </div>
              </div>

              <div v-else v-for="(notification, index) in notifications" :key="index"
                :class="['carousel-item', { active: index === 0 }]">
                <div class="d-block w-100 text-center p-4">
                  <h2>Notifica {{ index + 1 }}</h2>
                  <p>
                    <strong>Messaggio:</strong> {{ notification.message }}<br>
                    <strong>Data:</strong> {{ new Date(notification.createdAt).toLocaleDateString() }}
                  </p>
                  <button @click="deleteNotification(notification._id)" class="btn btn-danger">Elimina</button>
                </div>
              </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#carouselNotifications"
              data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#carouselNotifications"
              data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/* import NavigationBar from '../components/NavigationBar.vue';
 */
import axios from 'axios';

export default {
  name: 'HomePrincipale',
  /* components: {
    NavigationBar,
  }, */
  data() {
    return {
      username: localStorage.getItem('username'),
      lastEventTitle: '',
      lastEventDescription: '',
      lastEventDate: '',
      lastActivityTitle: '',
      lastActivityDescription: '',
      lastActivityDeadline: '',
      noActivitiesMessage: '',

      notifications: [],
      noNotificationsMessage: '',

      users: [], // array con tutti gli utenti
      selectedUsers: [], //ID degli utenti selezionati
      notificationMessage: '',// Il messaggio personalizzato inserito dall'utente
      lastNoteHeading: '',
      lastNoteAuthor: '',
      noEventsMessage: '',
      noNotesMessage: '',
      noPomodorosMessage: '',
      lastPomodoroTempoStudio: '',
      lastPomodoroTempoPausa: '',
      lastPomodoroRipetizioni: '',
      currentEventTitle: '',
      currentEventDescription: '',
      currentEventDate: '',
      currentActivityTitle: '',
      currentActivityDescription: '',
      currentActivityDeadline: '',
      isCurrentDay: false,
      isCurrentDayActivity: false,
      notificationEnabled: false,
    };
  },
  mounted() {
    this.getLastEvent();
    this.getLastActivity();
    this.getNotifies();
    this.getUsers();
    this.getLastNote();
    this.getLastPomodoro();
  },
  methods: {
    async getLastEvent() {
      try {
        const token = sessionStorage.getItem('token');
        console.log("token home ", token);
        const response = await axios.get('/api/events/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: this.username }
        });
        if (response.data) {
          this.lastEventTitle = response.data.title || 'Nessun evento';
          this.lastEventDescription = response.data.description || 'Nessuna descrizione';
          this.lastEventDate = response.data.date || 'Nessuna data';
        } else {
          this.noEventsMessage = 'Nessun evento trovato.';
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'ultimo evento:', error);
        this.noEventsMessage = 'Errore nel caricamento dell\'ultimo evento.';
      }
    },


    async getLastActivity() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/activities/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        if (response.data) {
          this.lastActivityTitle = response.data.title;
          this.lastActivityDescription = response.data.description;
          this.lastActivityDeadline = new Date(response.data.deadline).toLocaleDateString();
          this.noActivitiesMessage = '';
        } else {
          this.noActivitiesMessage = 'Non ci sono attività imminenti';
        }

      } catch (error) {
        console.error('Errore nel recupero delle attività:', error);
      }
    },

    async getNotifies() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/notifications/getNotif', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: this.username }
        });
        //console.log(response.data);
        if (response.data) {
          this.notifications = response.data;
        } else {
          this.noNotificationsMessage = 'Nessuna notifica trovata.';
        }
      } catch (error) {
        console.error('Errore nel recupero delle notifiche :', error);
        this.noNotificationsMessage = 'Errore caricamento delle notifiche.';
      }
    },

    async getUsers() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: this.username }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
      }
    },

    // Invia le notifiche agli utenti selezionati
    async sendNotifications() {
      if (this.selectedUsers.length === 0) {
        alert('Seleziona almeno un utente per inviare una notifica.');
        return;
      }

      if (this.notificationMessage.trim() === '') {
        alert('Scrivi un messaggio per inviare una notifica.');
        return;
      }

      try {
        const token = sessionStorage.getItem('token');

        await axios.post('/api/notifications/send', {
          recipients: this.selectedUsers,
          message: this.notificationMessage
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert('notifiche inviate!');
      } catch (error) {
        console.error('errore durante invio notifiche:', error);
        alert('Errore durante invio notifiche.');
      }
    },

    async deleteNotification(notificationId) {
      try {
        const token = sessionStorage.getItem('token');

        await axios.delete(`/api/notifications/${notificationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // tolgo la notifica dalla lista
        this.notifications = this.notifications.filter(notification => notification._id !== notificationId);
        alert('Notifica eliminata, aggiorna pagina per vedere effetto');
      } catch (error) {
        console.error('errore durante eliminazione notifica:', error);
        alert('errore durante leliminazione della notifica.');
      }
    },

    async getLastNote() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/notes/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: username }
        });

        if (response.data) {
          this.lastNoteHeading = response.data.heading;
          this.lastNoteAuthor = response.data.author;
          this.noNotesMessage = '';
        } else {
          this.noNotesMessage = 'Non ci sono note trovate';
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'ultima nota:', error);
        this.noNotesMessage = 'Errore nel caricamento dell\'ultima nota.';
      }
    },
    async getLastPomodoro() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/poms/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        if (response.data) {
          this.lastPomodoroTempoStudio = response.data.tempoStudio;
          this.lastPomodoroTempoPausa = response.data.tempoPausa;
          this.lastPomodoroRipetizioni = response.data.ripetizioni;
          this.noPomodorosMessage = '';
        } else {
          this.noPomodorosMessage = 'Nessun pomodoro trovato';
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'ultimo pomodoro:', error);
        this.noPomodorosMessage = 'Errore nel caricamento dell\'ultimo pomodoro.';
      }
    },
    async getCurrentDayEvents() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/events/current-day', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        if (response.data && response.data.length > 0) {
          // Assumiamo che la risposta sia un array di eventi
          const event = response.data[0]; // Prendiamo il primo evento
          this.lastEventTitle = event.title;
          this.lastEventDescription = event.description;
          this.lastEventDate = new Date(event.date).toLocaleDateString();
          this.noEventsMessage = '';
          this.isCurrentDay = true;
          // Puliamo il messaggio di errore
        } else {
          this.noEventsMessage = 'Non ci sono eventi imminenti';
          this.lastEventTitle = '';
          this.lastEventDescription = '';
          this.lastEventDate = '';
        }
        console.log("eventi del giorno corrente", response.data);
      } catch (error) {
        console.error('Errore nel recupero degli eventi del giorno corrente:', error);
        this.noEventsMessage = 'Errore nel caricamento degli eventi del giorno corrente.';
        this.lastEventTitle = '';
        this.lastEventDescription = '';
        this.lastEventDate = '';
      }
    },
    async getCurrentDayActivities() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/activities/current-day', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        if (response.data && response.data.length > 0) {
          const activity = response.data[0];
          this.lastActivityTitle = activity.title;
          this.lastActivityDescription = activity.description;
          this.lastActivityDeadline = new Date(activity.deadline).toLocaleDateString();
          this.noActivitiesMessage = '';
          this.isCurrentDayActivity = true;
        } else {
          this.noActivitiesMessage = 'Non ci sono attività imminenti';
          this.lastActivityTitle = '';
          this.lastActivityDescription = '';
          this.lastActivityDeadline = '';
          this.isCurrentDayActivity = true;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.noActivitiesMessage = 'Non ci sono attività imminenti123';
          console.log("no", error);
          this.lastActivityTitle = '';
          this.lastActivityDescription = '';
          this.lastActivityDeadline = '';
          this.isCurrentDayActivity = true;
        } else {
          console.error('Errore nel recupero delle attività del giorno corrente:', error);
          this.noActivitiesMessage = 'Errore nel caricamento delle attività del giorno corrente.';
        }
      }
    },    
  },

};
</script>

<style scoped>
body {
  background: linear-gradient(to bottom, #0000ff, #ffffff);
  margin: 0;
}

.home-principale {
  text-align: center;
  background-image: url('https://images.hdqwalls.com/wallpapers/abstract-shapes-4k-q2.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  /* Imposta l'altezza minima per riempire la viewport */
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(0, 0, 0);
  /* colore testo */
}

.carousel-item {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #000;
  border-radius: 50%;
}

.notification-form {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  height: 100px;
  resize: vertical;
}

button.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button.btn:hover {
  background-color: #0056b3;
}

button.btn-danger {
  background-color: rgb(194, 27, 27);
}
</style>