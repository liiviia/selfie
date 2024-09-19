<template>
  <div class="home-principale">
    
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        
        
        <div class="hamburger-menu">
          <input id="menu__toggle" type="checkbox" />
          <label class="menu__btn" for="menu__toggle">
            <span></span>
          </label>
          
        </div>
        
       
        <a class="navbar-brand" href="/">ToDo APP</a>
  
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto">
            <li v-if="username" class="nav-item">
              <a class="nav-link" href="/logout">Logout</a>
            </li>
           
          </ul>
        </div>
      </div>
    </nav>

    
    <div class="container mt-4 p-3 p-md-4">
      <img class="w3-image img-fluid" src="https://images.hdqwalls.com/wallpapers/abstract-shapes-4k-q2.jpg" alt="Me" style="max-width: 100%; max-height: 100%; height: auto; width: auto;">
      <div class="responsive-container">
        <div class="responsive-content w3-border w3-wide w3-text-light-grey">
          <h1 class="d-none d-md-block">SELFIE APP</h1>
          <h5 class="d-block d-md-none">SELFIE APP</h5>
          <h3 class="d-none d-md-block">TW 2024</h3>
          <ul>
            <li><a class="menu__item" href="/pomodoroTempo">Pomodoro</a></li>
            <li><a class="menu__item" href="/todo">lista Note</a></li>
            <li><a class="menu__item" href="/calendarEvent">Calendario</a></li>
            <li><a class="menu__item" href="/addEvent">Aggiungi evento</a></li>
            <li><a class="menu__item" href="/eventsE">Lista eventi</a></li> 
            <li><a class="menu__item" href="/addActivities">Aggiungi attivita</a></li>
            <li><a class="menu__item" href="/activities">Lista attivita</a></li> 
            <li><a class="menu_item" href="/pomSession">sessioni pomodoro</a></li>
            <li><a class="menu_item" href="/composeNotes">tutte le note</a></li>
          </ul>
    </div>
        </div>
      </div>
      
    <h1>Benvenuto, {{ username }}!</h1>
    
   

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
  margin-top: 20px;
}
</style>
