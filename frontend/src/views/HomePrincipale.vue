<template>

  <div class="home-principale">
    <div class="container mt-3">
      <div class="row">
        <div class="col-md-6 d-flex justify-content-center align-items-center">
          <img class="img-fluid mt-3" src="https://images.hdqwalls.com/wallpapers/abstract-shapes-4k-q2.jpg"
            alt="Immagine Home" style="max-width: 80%; height: auto;">
        </div>

        <div class="col-md-6">
          <div id="carouselExampleIndicators" class="carousel slide mt-4" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <div class="d-block w-100 text-center p-4">
                  <h2>Ultimo Evento</h2>
                  <p v-if="noEventsMessage">{{ noEventsMessage }}</p>
                  <p v-else>
                    <strong>Titolo:</strong> {{ lastEventTitle }}<br>
                    <strong>Descrizione:</strong> {{ lastEventDescription }}<br>
                    <strong>Data:</strong> {{ lastEventDate }}
                  </p>
                </div>
              </div>

              <div class="carousel-item">
                <div class="d-block w-100 text-center p-4">
                  <h2>Ultima Attività</h2>
                  <p v-if="noActivitiesMessage">{{ noActivitiesMessage }}</p>
                  <p v-else>
                    <strong>Titolo:</strong> {{ lastActivityTitle }}<br>
                    <strong>Descrizione:</strong> {{ lastActivityDescription }}<br>
                    <strong>Scadenza:</strong> {{ lastActivityDeadline }}
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
                      :data-bs-target="'#carouselNotifications'" :data-bs-slide-to="index" 
                      :class="{ active: index === 0 }" :aria-current="index === 0 ? 'true' : 'false'"
                      :aria-label="'Slide ' + (index + 1)">
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
      username: localStorage.getItem('username') || 'Guest',
      lastEventTitle: '',
      lastEventDescription: '',
      lastEventDate: '',
      lastActivityTitle: '',
      lastActivityDescription: '',
      lastActivityDeadline: '',
      noEventsMessage: '',
      noActivitiesMessage: '',

      notifications: [],
      noNotificationsMessage:''
    };
  },
  mounted() {
    this.getLastEvent();
    this.getLastActivity();
    this.getNotifies();
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

    logout() {
      localStorage.clear();
      this.$router.push('/');
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

    async getNotifies(){
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/notifications/getNotif', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: this.username }
        });
        console.log(response.data);
        if (response.data) {
          this.notifications=response.data;
        } else {
          this.noNotificationsMessage = 'Nessuna notifica trovata.';        }
      } catch (error) {
        console.error('Errore nel recupero delle notifiche :', error);
        this.noNotificationsMessage = 'Errore caricamento delle notifiche.';
      }
    }
  }

};
</script>

<style scoped>
body {
  background: linear-gradient(to bottom, #0000ff, #ffffff);
  margin: 0;
}

.home-principale {
  text-align: center;
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

</style>