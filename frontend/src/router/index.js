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
import registratiAccedi from '../views/registratiAccedi.vue'
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

  {
    path: '/registratiAccedi',
    name: 'registratiAccedi',
    component: registratiAccedi,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/*// Verifica se l'utente è autenticato controllando il token di accesso nel localStorage
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userToken'); 

  // Se la rotta richiede autenticazione e l'utente non è autenticato
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/'); // Reindirizza alla pagina di login
  } else {
    next(); // Altrimenti consenti l'accesso
  }
});*/

export default router;
