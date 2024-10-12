<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <!-- Contenitore flessibile per sidebar e link Home -->
      <div class="d-flex align-items-center">
        <!-- Button per aprire la sidebar -->
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        
      </div>

        <!-- Time Machine Controls, mostra solo nelle pagine specificate -->
        <div v-if="showTimeMachine" class="time-machine-control d-flex ms-3">
          <div>
            <label for="date">Data:</label>
            <input type="date" v-model="timeMachineDate">
            <label for="time">Ora:</label>
            <input type="time" v-model="timeMachineTime">
            <button @click="setTimeMachine">Imposta</button>
            <button @click="resetTimeMachine">Reset</button>
          </div>
          <div>
            <p>Orologio: {{ simulatedTime }}</p>
          </div>
        </div>

       <!-- Pulsanti Home e Gestione Profilo allineati a destra -->
      <div class="d-flex ms-auto align-items-center">
        <!-- Pulsante Home -->
        <a class="navbar-brand me-4" href="/homePrincipale">
            <i class="fas fa-home"></i>
        </a>

        <!-- Pulsante Gestione Profilo -->
        <a class="me-4" href="/accountUtente">
            <i class="fas fa-user" style="color: black;"></i>
            <span class="username-initials">{{ username }}</span>
        </a>

        <!-- Notifiche -->
        <a class="me-4" href="#" @click="toggleNotifications">
          <i class="fas fa-bell" style="color: black;"></i> 
          <span v-if="notifications.length" class="badge">{{ notifications.length }}</span> 
        </a>

        <div v-if="showNotifications" class="notifications-dropdown">
          <ul>
            <li v-for="notification in notifications" :key="notification._id">
              titolo: {{ notification.title }} - Scadenza: {{ notification.deadline }}
            </li>
            <li v-if="notifications.length === 0">
              Nessuna notifica
            </li>
          </ul>
          <button @click="sendEmail" class="btn btn-primary">Invia Email</button> <!-- Pulsante per inviare l'email -->
        </div>        

      </div>

      <!-- Offcanvas Sidebar -->
      <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav me-auto">
            <span class="nav-item username-text">
              Benvenuto, {{ username }}!
            </span>
            <!-- link Note -->
            <li class="nav-item"><a class="nav-link" href="/todo">Note</a></li>

            <!-- dropdown Eventi -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="eventDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Eventi
              </a>
              <ul class="dropdown-menu" aria-labelledby="eventDropdown">
                <li><a class="dropdown-item" href="/addEvent">Aggiungi evento</a></li>
                <li><a class="dropdown-item" href="/eventsE">Lista eventi</a></li>
              </ul>
            </li>
  
            <!-- dropdown Attività -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="activityDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Attività
              </a>
              <ul class="dropdown-menu" aria-labelledby="activityDropdown">
                <li><a class="dropdown-item" href="/addActivities">Aggiungi attività</a></li>
                <li><a class="dropdown-item" href="/activities">Lista attività</a></li>
              </ul>
            </li>
  
            <!-- altri link -->
            <li class="nav-item"><a class="nav-link" href="/calendarEvent">Calendario</a></li>
            <li class="nav-item"><a class="nav-link" href="/pomodoroTempo">Pomodoro</a></li>
            <li class="nav-item"><a class="nav-link" href="/pomSession">Sessioni Pomodoro</a></li>
            <!-- <li class="nav-item"><a class="nav-link" href="/accountUtente">Gestisci il tuo Account</a></li> --> 
          </ul>
          <!-- Logout Button -->
          <button type="button" class="btn btn-dark mt-3" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
  </template>
  
<script>

import axios from 'axios';

  export default {
    data() {
      return {
        username: localStorage.getItem('username') || 'Guest',
        timeMachineDate: '',  
        timeMachineTime: '',  
        simulatedTime: '--:--:--', 
        intervalId: null, 
        currentSimulatedTime: null,
        showNotifications: false, // Controlla se il menu delle notifiche è visibile
        notifications: [] //contiene notifiche
      };
    }, 
    computed:{
      currentPage() {
        const routeNameMap = {
          '/': 'Login', 
          '/homePrincipale': 'Home',
          '/pomodoroTempo': 'Pomodoro',
          '/todo': 'Lista Note',
          '/calendarEvent': 'Calendario',
          '/addEvent': 'Aggiungi Evento',
          '/eventsE': 'Lista Eventi',
          '/addActivities': 'Aggiungi Attività',
          '/activities': 'Lista Attività',
          '/pomSession': 'Sessioni Pomodoro',
          '/accountUtente': 'Gestisci il tuo Account',
        };
        return routeNameMap[this.$route.path] || ''; // Mostra il nome della pagina corrente
      },
      showTimeMachine() {
        // Controlla se la pagina corrente è una di quelle in cui vogliamo mostrare la Time Machine
        const routesWithTimeMachine = [
          '/todo',              // Lista Note
          '/calendarEvent',      // Calendario
          '/eventsE',            // Lista Eventi
          '/activities',         // Lista Attività
          '/pomSession'          // Sessioni Pomodoro
        ];
        return routesWithTimeMachine.includes(this.$route.path);
      }
    },
    methods:{
      setTimeMachine() {
        if (this.timeMachineDate && this.timeMachineTime) {
          const newDateTime = new Date(`${this.timeMachineDate}T${this.timeMachineTime}`);
          this.currentSimulatedTime = newDateTime;
          this.simulatedTime = this.currentSimulatedTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          this.startTimeFlow();
        }
      },
      resetTimeMachine() {
        clearInterval(this.intervalId);
        this.simulatedTime = '--:--:--'; 
        this.currentSimulatedTime = null;
      },
      startTimeFlow() {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
          if (this.currentSimulatedTime) {
            this.currentSimulatedTime.setSeconds(this.currentSimulatedTime.getSeconds() + 1);
            this.simulatedTime = this.currentSimulatedTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          }
        }, 1000); 
      },

      logout() {
        localStorage.clear();
        this.isAut=false;
        console.log("autenticato:", this.isAut);
        this.$router.push('/'); // Ritorna alla pagina di login
    },


      async toggleNotifications(){
        // Mostra o nasconde il menu delle notifiche
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {
          await this.checkDeadlines();
        }
      },
  

      async checkDeadlines() {
        try {
          const token = sessionStorage.getItem('token');
          const username = localStorage.getItem('username');
          const response = await axios.get('/api/activities/2days', {
            headers: {Authorization: `Bearer ${token}`},
            params:{username: username}
          });
          this.notifications = response.data; // Salva le notifiche nella variabile
          console.log(this.notifications);
          console.log(response.data);
          //alert('Email inviata con successo!');
        } catch (error) {
          console.error('Errore nel recupero delle notifiche:', error);
        } 
      },


      async sendEmail() {
        try {
          const token = sessionStorage.getItem('token');
          const username = localStorage.getItem('username');
          const response = await axios.post('/api/activities/sendEmail', 
            { username: username },  // Dati nel body della richiesta
            {headers: { Authorization: `Bearer ${token}` }  // Headers separati
            }
          );
          alert(response.data.message); // Mostra il messaggio di successo o errore
        } catch (error) {
          console.error('Errore nell invio dell email:', error);
          alert('Errore durante invio email');
        }
      }      
      // mounted() {
      //  this.checkDeadlines();
      // }
      
    }
    
  };

</script>

<style scoped>
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  /* ombreggiatura navbar */
}

.nav-link {
  padding: 10px 15px;
  transition: background-color 0.3s;
  /* transizione passaggio del mouse */
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  /* cambia colore al passaggio del mouse */
  border-radius: 5px;
  /* angoli arrotondati */
}

.btn-danger {
  margin-left: 10px;
  /* margine pulsante Logout */
}

/* effetto di hover per il pulsante */
.btn-danger:hover {
  background-color: #c82333;
  /* colore scuro al passaggio del mouse */
  transition: background-color 0.3s;
}

.username-text{
  color: #1100ff; /* Cambia con il colore che preferisci */
  font-weight: bold;
}


.time-machine-control {
  display: flex;
  align-items: center;
}

.time-machine-control input {
  margin-right: 10px;
  padding: 5px;
  border-radius: 8px; 
  border: 1px solid #ccc; 
  outline: none;
}

.time-machine-control button {
  margin-right: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 8px 15px;
  font-size: 0.9em;
  border-radius: 10px;
  cursor: pointer;
}

.time-machine-control button:hover {
  background-color: #0056b3;
}

.notifications-dropdown {
  position: absolute;
  top: 50px; /* Aggiusta in base alla tua navbar */
  right: 10px;
  width: 200px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000; /* Assicurati che sia sopra altri elementi */
}

.notifications-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notifications-dropdown li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.notifications-dropdown li:last-child {
  border-bottom: none;
}

.notifications-dropdown button {
  margin-top: 10px;
  width: 100%; /* Rende il pulsante a larghezza piena */
}

</style>