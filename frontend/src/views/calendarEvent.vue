<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ currentMonthYear }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-body">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      <div class="days">
        <div 
          v-for="day in calendarDays" 
          :key="day.date" 
          :class="{ 'current-month': day.currentMonth, 'other-month': !day.currentMonth, 'today': day.isToday, 'has-events': day.hasEvents, 'has-activities': day.hasActivities }"
          @click="selectDate(day)"
        >
          {{ day.dayOfMonth }}
          <div v-if="day.hasEvents" class="event-indicator"></div>
          <div v-if="day.hasActivities" class="activity-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const currentDate = ref(new Date());
    const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const eventsMap = ref({});
    const activityMap = ref({});
    const calendarDays = ref([]);

    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
    });

    // Funzione per formattare la data in formato "YYYY-MM-DD" locale
    function formatDateToLocal(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // I mesi sono indicizzati da 0, quindi aggiungi 1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function createDayObject(date, currentMonth, today) {
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateString = formatDateToLocal(localDate); // Usa la funzione per formattare la data localmente
      return {
        date: localDate,
        dayOfMonth: localDate.getDate(),
        currentMonth: currentMonth,
        isToday: localDate.toDateString() === today.toDateString(),
        hasEvents: eventsMap.value[dateString] || false,
        hasActivities: activityMap.value[dateString] || false
      };
    }

    function updateCalendarDays() {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const calendarArray = [];
      const today = new Date();

      // Giorni del mese precedente
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = new Date(year, month, -i);
        calendarArray.push(createDayObject(day, false, today));
      }

      // Giorni del mese corrente
      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(year, month, i);
        calendarArray.push(createDayObject(day, true, today));
      }

      // Giorni del mese successivo
      const remainingDays = 42 - calendarArray.length;
      for (let i = 1; i <= remainingDays; i++) {
        const day = new Date(year, month + 1, i);
        calendarArray.push(createDayObject(day, false, today));
      }

      calendarDays.value = calendarArray;
    }

    async function fetchEvents() {
      try {
        const username = localStorage.getItem('username');
        const token = sessionStorage.getItem('token');
        if (!username || !token) {
          console.error('Username o token mancante. L\'utente potrebbe non essere autenticato.');
          return;
        }

        const response = await axios.get(`/api/eventsGET`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: username }
        });
        const events = response.data;


        const activityResponse = await axios.get(`/api/activitiesGET`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });
        const activities = activityResponse.data;
        // Resetta eventsMap
        eventsMap.value = {};
        activityMap.value = {};

        // Popola eventsMap
        events.forEach(event => {
          const eventDate = new Date(event.date);
          const dateString = formatDateToLocal(eventDate); // Formatta la data in formato locale
          eventsMap.value[dateString] = true;
        });

        activities.forEach(activity => {
          const activityDate = new Date(activity.deadline);
          const dateString = formatDateToLocal(activityDate); // Formatta la data in formato locale
          activityMap.value[dateString] = true;
        });

        updateCalendarDays();
      } catch (error) {
        if (error.response) {
          console.error('Errore nella risposta del server:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Nessuna risposta ricevuta dal server:', error.request);
        } else {
          console.error('Errore durante l\'impostazione della richiesta:', error.message);
        }
      }
    }

    function prevMonth() {
      const newDate = new Date(currentDate.value);
      newDate.setMonth(newDate.getMonth() - 1);
      currentDate.value = newDate;
      updateCalendarDays();
    }

    function nextMonth() {
      const newDate = new Date(currentDate.value);
      newDate.setMonth(newDate.getMonth() + 1);
      currentDate.value = newDate;
      updateCalendarDays();
    }

    function selectDate(day) {
      const username = localStorage.getItem('username');
      const dateString = formatDateToLocal(day.date); 
      console.log("dateString", dateString);
      router.push({
        name: 'eventDayCalendar',
        query: { author: username,
           date: dateString }
      });
    }

    onMounted(async () => {
      await fetchEvents();
      updateCalendarDays();
    });

    watch(currentDate, async () => {
      await fetchEvents();
      updateCalendarDays();
    });

    return {
      currentDate,
      weekdays,
      currentMonthYear,
      calendarDays,
      prevMonth,
      nextMonth,
      selectDate
    };
  }
};
</script>

<style scoped>
.has-events {
  position: relative;
}

.event-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #007bff;
  border-radius: 50%;
}

.calendar {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header button {
  background-color: #f0f0f0;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
}

.weekdays, .days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.weekdays div {
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.days div {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.days div:hover {
  background-color: #f0f0f0;
}

.other-month {
  color: #ccc;
}

.today {
  background-color: #e6f2ff;
  font-weight: bold;
}

.selected-date {
  margin-top: 20px;
  text-align: center;
}

.has-activities {
  position: relative;
}

.activity-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px; /* Posizionato a destra dell'event-indicator */
  width: 6px;
  height: 6px;
  background-color: #ffa500; /* Colore arancione per le attività */
  border-radius: 50%;
}

/* Aggiusta la posizione dell'event-indicator */
.event-indicator {
  left: 2px;
  transform: none;
}


</style>
