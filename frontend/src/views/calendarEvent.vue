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
          <div class="day-content">
            <span class="day-number">{{ day.dayOfMonth }}</span>
            <div class="indicators">
              
              <div v-if="day.hasEvents && day.hasActivities" class="both-indicator">
                Ci sono attività ed eventi
              </div>
              <div v-else-if="day.hasEvents" class="event-indicator">
                C'è un evento
              </div>
              <div v-else-if="day.hasActivities" class="activity-indicator">
                C'è un'attività
              </div>
            </div>
          </div>
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


    function formatDateToLocal(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function createDayObject(date, currentMonth, today) {
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateString = formatDateToLocal(localDate); 
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


      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = new Date(year, month, -i);
        calendarArray.push(createDayObject(day, false, today));
      }


      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(year, month, i);
        calendarArray.push(createDayObject(day, true, today));
      }


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
        
        eventsMap.value = {};
        activityMap.value = {};

        
        events.forEach(event => {
          const eventDate = new Date(event.date);
          const dateString = formatDateToLocal(eventDate);
          eventsMap.value[dateString] = true;
        });

        activities.forEach(activity => {
          const activityDate = new Date(activity.deadline);
          const dateString = formatDateToLocal(activityDate); 
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
.calendar {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background-color: #fff; 
  border-radius: 10px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  padding: 20px; 
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.calendar-header button:hover {
  background-color: #0056b3; 
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
  border-radius: 5px; 
}

.days div {
  border: 1px solid #ddd;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  height: 100px;
  border-radius: 10px; 
  transition: transform 0.2s, background-color 0.3s ease;
  background-color: #fff;
}

.days div:hover {
  background-color: #f0f0f0;
  transform: scale(1.05); 
}

.day-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.day-number {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 5px;
}

.indicators {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-indicator, .activity-indicator {
  font-size: 0.7em;
  padding: 2px;
  border-radius: 3px;
}

.event-indicator {
  background-color: #e6f2ff;
  color: #007bff;
}

.activity-indicator {
  background-color: #fff5e6;
  color: #ffa500;
}

.other-month {
  opacity: 0.5;
}

.today {
  background-color: #e6f2ff;
  font-weight: bold;
  border-radius: 10px; 
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.3); 
}


.both-indicator {
  background-color: #d1f7d6;
  color: #2f8f2f;
  font-size: 0.8em;
  padding: 2px;
  border-radius: 3px;
  text-align: center;
}

.event-indicator {
  background-color: #e6f2ff;
  color: #007bff;
  font-size: 0.8em;
  padding: 2px;
  border-radius: 3px;
  text-align: center;
}

.activity-indicator {
  background-color: #fff5e6;
  color: #ffa500;
  font-size: 0.8em;
  padding: 2px;
  border-radius: 3px;
  text-align: center;
}




</style>