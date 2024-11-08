<template>
  <div class="container">
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ currentMonthYear }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>

     <div class="legend">
      <div class="legend-item">
        <span class="event-dot"></span> Eventi
      </div>
      <div class="legend-item">
        <span class="activity-dot"></span> Attività
      </div>
      <div class="legend-item">
        <span class="pomodoro-dot"></span> Pomodori
      </div>
    </div>

    <div class="calendar-body">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      <div class="days">
        <div 
          v-for="day in calendarDays" 
          :key="day.date" 
          :class="{ 'current-month': day.currentMonth, 'other-month': !day.currentMonth, 'today': day.isToday }"
          @click="selectDate(day)"
        >
          <div class="day-content">
            <span class="day-number">{{ day.dayOfMonth }}</span>
            <div class="indicators">
              <span v-if="day.hasEvents" class="event-dot"></span>
              <span v-if="day.hasActivities" class="activity-dot"></span>
              <span v-if="day.hasPomodoros" class="pomodoro-dot"></span>
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
import { EventBus } from '@/EventBus';

export default {
  setup() {
    const router = useRouter();
    const currentDate = ref(new Date());
    const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const eventsMap = ref({});
    const activityMap = ref({});
    const pomodoroMap = ref({});
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
        hasEvents: !!eventsMap.value[dateString],
        hasActivities: !!activityMap.value[dateString],
        hasPomodoros: !!pomodoroMap.value[dateString],
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

    const pomodoroResponse = await axios.get(`/api/poms`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { username: username }
    });
    const pomodoros = pomodoroResponse.data;

    console.log("Risposta API Pomodori:", pomodoroResponse.data);

    eventsMap.value = {};
    activityMap.value = {};
    pomodoroMap.value = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today; // Mantiene solo gli eventi non scaduti
      })
      .forEach(event => {
        const eventDate = new Date(event.date);
        const dateString = formatDateToLocal(eventDate);
        eventsMap.value[dateString] = true;
      });

    activities
      .filter(activity => {
        const activityDate = new Date(activity.deadline);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate >= today; // Mantiene solo le attività non scadute
      })
      .forEach(activity => {
        const activityDate = new Date(activity.deadline);
        const dateString = formatDateToLocal(activityDate); 
        activityMap.value[dateString] = true;
      });

    pomodoros
      .filter(pomodoro => {
        const pomodoroDate = new Date(pomodoro.giorno);
        pomodoroDate.setHours(0, 0, 0, 0);
        return pomodoroDate >= today; // Mantiene solo i pomodori non scaduti
      })
      .forEach(pomodoro => {
        const pomodoroDate = new Date(pomodoro.giorno);
        const dateString = formatDateToLocal(pomodoroDate);
        pomodoroMap.value[dateString] = true;
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
        query: { author: username, date: dateString }
      });
    }

    onMounted(async () => {
      await fetchEvents();
      updateCalendarDays();

      EventBus.on('timeMachineSet', (simulatedTime) => {
        currentDate.value = simulatedTime;
        updateCalendarDays();
      });

      EventBus.on('timeMachineUpdate', (simulatedTime) => {
        currentDate.value = simulatedTime;
        updateCalendarDays();
      });

      EventBus.on('timeMachineReset', () => {
        currentDate.value = new Date();
        updateCalendarDays();
      });
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
      selectDate,
    };
  }, 
  beforeUnmount() {
    EventBus.off('timeMachineSet');
    EventBus.off('timeMachineUpdate');
    EventBus.off('timeMachineReset');
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
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
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
  gap: 4px;
  justify-content: center;
  margin-top: 5px;
}

.legend {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.event-dot, .activity-dot, .pomodoro-dot {
  height: 8px; 
  width: 8px;
  border-radius: 50%; 
  display: inline-block;
}

.event-dot {
  background-color: blue;
}

.activity-dot {
  background-color: green;
}

.pomodoro-dot {
  background-color: red;
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

@media (max-width: 600px) {
  .calendar {
    padding: 10px; 
  }

  .calendar-header button {
    font-size: 14px;
    padding: 8px; 
  }

  .weekdays {
    grid-template-columns: repeat(7, 1fr); 
  }

  .days {
    grid-template-columns: repeat(7, 1fr); 
  }
  .weekdays div {
  display: flex;
  justify-content: center; 
  align-items: center;
  text-align: center; 
}

.days div {
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  text-align: center; 
}


  .days div {
    height: 70px; 
    font-size: 1.0em; 
    display: flex; 
    flex-direction: column;
    align-items: center; 
    justify-content: center; 
    padding: 5px; 
    border: 1px solid transparent; 
    padding-left: 1000px; 
  }

  .days div:nth-child(7n + 1) {
    padding-left: 0; 
  }

  .days div:not(:nth-child(7n + 1)) {
    padding-left: 0px; 
  }

  .day-number {
    font-size: 1.2em;
    font-weight: bold; 
    margin-bottom: 5px; 
  }

  .indicators {
    justify-content: center; 
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
  .calendar {
  max-width: 600px; 
  padding: 10px; 
}

.calendar-header button {
  font-size: 14px; 
  padding: 8px 12px; 
}

.weekdays div, .days div {
  padding: 5px; 
  font-size: 0.9em; 
}

.days div {
  height: 80px; 
}

.day-number {
  font-size: 1em; 
}

}



</style>
