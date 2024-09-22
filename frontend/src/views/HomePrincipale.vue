<template>
  <div class="home-principale">
    <h1 class="mt-4">Benvenuto, {{ username }}!</h1>

    <nav class="navbar navbar-expand-lg bg-body-tertiary mt-3">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav d-flex justify-content-center">
            <li class="nav-item"><a class="nav-link" href="/pomodoroTempo">Pomodoro</a></li>
            <li class="nav-item"><a class="nav-link" href="/todo">Lista Note</a></li>
            <li class="nav-item"><a class="nav-link" href="/calendarEvent">Calendario</a></li>
            <li class="nav-item"><a class="nav-link" href="/addEvent">Aggiungi evento</a></li>
            <li class="nav-item"><a class="nav-link" href="/eventsE">Lista eventi</a></li>
            <li class="nav-item"><a class="nav-link" href="/addActivities">Aggiungi attività</a></li>
            <li class="nav-item"><a class="nav-link" href="/activities">Lista attività</a></li>
            <li class="nav-item"><a class="nav-link" href="/pomSession">Sessioni Pomodoro</a></li>
            <li class="nav-item"><a class="nav-link" href="/accountUtente">Gestisci il tuo Account</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-3">
      <div class="row">
        <div class="col-md-6 d-flex justify-content-center align-items-center">
          <img class="img-fluid mt-3" src="https://images.hdqwalls.com/wallpapers/abstract-shapes-4k-q2.jpg" alt="Immagine Home" style="max-width: 80%; height: auto;">
        </div>

        <div class="col-md-6">
          <div id="carouselExampleIndicators" class="carousel slide mt-4" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <div class="d-block w-100 text-center p-4">
                  <h2>Ultimo Evento</h2>
                  <p><strong>Titolo:</strong> {{ lastEventTitle }}</p>
                  <p><strong>Descrizione:</strong> {{ lastEventDescription }}</p>
                  <p><strong>Data:</strong> {{ lastEventDate }}</p>
                </div>
              </div>
              <div class="carousel-item">
                <div class="d-block w-100 text-center p-4">
                  <h2>Ultima Attività</h2>
                  <p><strong>Titolo:</strong> {{ lastActivityTitle }}</p>
                  <p><strong>Descrizione:</strong> {{ lastActivityDescription }}</p>
                  <p><strong>Scadenza:</strong> {{ lastActivityDeadline }}</p>
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
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
import axios from 'axios';

export default {
  name: 'HomePrincipale',
  data() {
    return {
      username: localStorage.getItem('username') || 'Guest',
      lastEventTitle: '',
      lastEventDescription: '',
      lastEventDate: '',
      lastActivityTitle: '',
      lastActivityDescription: '',
      lastActivityDeadline: ''
    };
  },
  mounted() {
    this.getLastEvent();
    this.getLastActivity();
  },
  methods: {
     async getLastEvent() {
      try {
        const username = localStorage.getItem('username'); 
        const response = await axios.get('/api/events/last', {
          params: { username: username }
        });
      this.lastEventTitle = response.data.title;
      this.lastEventDescription = response.data.description;
      this.lastEventDate = new Date(response.data.date).toLocaleDateString();
        

      } catch(error) {
        console.error('Errore nel recupero degli eventi:', error);

      }
    },
  
  
  async getLastActivity() {
    try {
      const username = localStorage.getItem('username'); 
      const response = await axios.get('/api/activities/last', {
        params: { username: username }
      });

      this.lastActivityTitle = response.data.title;
      this.lastActivityDescription = response.data.description;
      this.lastActivityDeadline = new Date(response.data.deadline).toLocaleDateString(); 

    } catch(error) {
      console.error('Errore nel recupero delle attività:', error);
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

.navbar {
  display: flex; 
  justify-content: center; 
}


</style>
