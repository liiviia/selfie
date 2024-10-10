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

       <!-- Pulsanti Home e Gestione Profilo allineati a destra -->
      <div class="d-flex ms-auto align-items-center">
        <!-- Pulsante Home -->
        <a class="navbar-brand me-4" href="/homePrincipale">
            <i class="fas fa-home"></i>
        </a>
        <!-- Pulsante Gestione Profilo -->
        <a class="me-4" href="/accountUtente">
            <i class="fa-solid fa-user" style="color: black;"></i>
        </a>
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
  export default {
    data() {
      return {
        username: localStorage.getItem('username') || 'Guest'
      };
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
</style>