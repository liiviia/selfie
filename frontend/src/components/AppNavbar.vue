<template>
  <div>
    <!-- Navbar Collapse -->
    <div class="collapse" id="navbarToggleExternalContent">
      <div class="bg-white p-4">
        <ul class="navbar-nav d-flex justify-content-center">
        <li class="nav-item">
            <router-link class="nav-link" to="/homePrincipale" @click="closeNavbar">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/pomodoroTempo" @click="closeNavbar">Pomodoro</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/todo" @click="closeNavbar">Lista Note</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/calendarEvent" @click="closeNavbar">Calendario</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/addEvent" @click="closeNavbar">Aggiungi evento</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/eventsE" @click="closeNavbar">Lista eventi</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/addActivities" @click="closeNavbar">Aggiungi attività</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/activities" @click="closeNavbar">Lista attività</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/pomSession" @click="closeNavbar">Sessioni Pomodoro</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/accountUtente" @click="closeNavbar">Gestisci il tuo Account</router-link>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-light bg-white">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <!-- Pulsante hamburger e titolo della pagina a sinistra -->
        <div class="d-flex align-items-center">
          <button class="navbar-toggler" type="button" @click="toggleNavbar" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div v-if="currentPage" class="navbar-page-title ms-3">
            {{ currentPage }}
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
// Importa solo il modulo Collapse di Bootstrap
import { Collapse } from 'bootstrap';

export default {
  computed: {
    currentPage() {
      const routeNameMap = {
        '/': 'Login', // Titolo della pagina di login
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
    }
  },
  methods: {
    closeNavbar() {
      const navbarCollapse = document.getElementById('navbarToggleExternalContent');
      if (navbarCollapse) {
        const bsCollapse = Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    },
    toggleNavbar() {
      const navbarCollapse = document.getElementById('navbarToggleExternalContent');
      if (navbarCollapse) {
        const bsCollapse = Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.toggle(); // Alterna apertura/chiusura
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/'); // Ritorna alla pagina di login
    }
  }
};
</script>

<style scoped>
.navbar {
  margin-top: 0;
  padding-top: 0;
  border: none;
}

.navbar-page-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.ms-3 {
  margin-left: 1rem;
}

.collapse {
  margin: 0;
  padding: 0;
}
</style>
