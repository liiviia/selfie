import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/userLogin.vue'; 
import nuovoUtente from '../views/registratiAccedi.vue'
import HomePrincipale from '../views/HomePrincipale.vue';
import ToDoApp from '../views/ToDoApp.vue'; 
import activities from '../views/ActivitiesPage.vue'
import addActivities from '../views/addActivities.vue'
import addEvent from '../views/addEvent.vue'
import calendarEvent from '../views/calendarEvent.vue'
import eventsE from '../views/eventsE.vue'
import pomodoroTempo from '../views/pomodoroTempo.vue'
import pomSession from '../views/pomSession.vue'
import editNote from '../views/editNote.vue';
import accountUtente from '@/views/accountUtente.vue';


const routes = [
  {
    path: '/',
    name: 'userLogin',
    component: UserLogin,
  },

  {
    path: '/accountUtente',
    name: 'accountUtente',
    component: accountUtente,
    meta: { requiresAuth: true } 
  },

  {
    path: '/registra',
    name: 'nuovoUtente',
    component: nuovoUtente,
  },

  {
    path: '/homePrincipale',
    name: 'HomePrincipale',
    component: HomePrincipale ,
    meta: { requiresAuth: true } 
  },

  {
    path: '/todo',
    name: 'ToDoApp',
    component: ToDoApp,
    meta: { requiresAuth: true } 

  },

  {
    path: '/edit-note/:id',
    name: 'editNote',
    component: editNote,
    meta: { requiresAuth: true } 
  },


  {
    path: '/activities',
    name: 'activities',
    component: activities,
    meta: { requiresAuth: true } 
  },

  {
    path: '/addActivities',
    name: 'addActivities',
    component: addActivities,
    meta: { requiresAuth: true } 
  },

  {
    path: '/addEvent',
    name: 'addEvent',
    component: addEvent,
    meta: { requiresAuth: true } 
  },

  {
    path: '/calendarEvent',
    name: 'calendarEvent',
    component: calendarEvent,
    meta: { requiresAuth: true } 
  },


  {
    path: '/eventsE',
    name: 'eventsE',
    component: eventsE,
    meta: { requiresAuth: true } 
  },


  {
    path: '/pomodoroTempo',
    name: 'pomodoroTempo',
    component: pomodoroTempo,
    meta: { requiresAuth: true } 
  },

  {
    path: '/pomSession',
    name: 'pomSession',
    component: pomSession,
    meta: { requiresAuth: true } 
  },


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// Guard globale per controllare il token
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token'); // Recupera il token dal sessionStorage

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Se la rotta richiede autenticazione e il token non è presente, reindirizza al login
    if (!token) {
      next({
        path: '/',
        query: { redirect: to.fullPath } // Dopo il login, reindirizza alla pagina richiesta
      });
    } else {
      next(); // Se il token è presente, consenti l'accesso alla rotta
    }
  } else {
    next(); // Se la rotta non richiede autenticazione, consenti l'accesso
  }
});





export default router;
