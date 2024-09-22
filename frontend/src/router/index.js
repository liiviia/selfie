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
  },

  {
    path: '/edit-note/:id',
    name: 'editNote',
    component: editNote,
  },


  {
    path: '/activities',
    name: 'activities',
    component: activities,
  },

  {
    path: '/addActivities',
    name: 'addActivities',
    component: addActivities,
  },

  {
    path: '/addEvent',
    name: 'addEvent',
    component: addEvent,
  },

  {
    path: '/calendarEvent',
    name: 'calendarEvent',
    component: calendarEvent,
  },


  {
    path: '/eventsE',
    name: 'eventsE',
    component: eventsE,
  },


  {
    path: '/pomodoroTempo',
    name: 'pomodoroTempo',
    component: pomodoroTempo,
  },

  {
    path: '/pomSession',
    name: 'pomSession',
    component: pomSession,
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






export default router;
