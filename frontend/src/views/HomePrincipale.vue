<template>
  <div class="home-principale">
    <h1 class="mt-4">Benvenuto, {{ username }}!</h1>
    
    <nav class="navbar navbar-expand-lg bg-body-tertiary mt-3">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/pomodoroTempo">Pomodoro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/todo">Lista Note</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/calendarEvent">Calendario</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/addEvent">Aggiungi evento</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/eventsE">Lista eventi</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/addActivities">Aggiungi attività</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/activities">Lista attività</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/pomSession">Sessioni Pomodoro</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/accountUtente">gestisci il tuo Account</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-3">
      <img class="img-fluid mx-auto d-block mt-3" src="https://images.hdqwalls.com/wallpapers/abstract-shapes-4k-q2.jpg" alt="Me" style="max-width: 80%; height: auto;">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePrincipale',
  data() {
    return {
      username: localStorage.getItem('username') || 'Guest'
    };
  }
};
</script>

<style scoped>
.home-principale {
  text-align: center;
}
</style>
