<template>
  <div class="container">
    <button @click="generateICS">Esporta in ICS</button>
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

  <button class="fixed-button" @click="openModal" style="background:#f4a460; margin-bottom: 50px;">
  non disponibile? segnalo qua!
</button>

<div v-if="openNotificationModal" class="modal" @click.self="closeNotificationModal">
      <div class="modal-dialog">
        <div class="modal-content" style="background: linear-gradient(to bottom, #f4a460, #eee8aa);">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Notifiche</h1>
          </div>
          <div class="modal-body">
            <p>Non disponibile? segnalalo qua!</p>
            <form @submit.prevent="submitForm">
              <input v-model="formData.startHour" type="number" placeholder="Start Hour" />
<input v-model="formData.startMinute" type="number" placeholder="Start Minute" />
<input v-model="formData.endHour" type="number" placeholder="End Hour" />
<input v-model="formData.endMinute" type="number" placeholder="End Minute" />
<input type="checkbox" v-model="formData.repeatDaily" /> Repeat Daily
<input v-if="!formData.repeatDaily" v-model="formData.giorno" type="date" placeholder="Giorno non disponibile" />
<button type="submit">Submit</button>
  </form>

          
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeNotificationModal" style="background:#f4a460;">Chiudi</button>
          </div>
        </div>
      </div>
    </div>



    <button class="fixed-button" @click="openUnavailableTimeModalFunction" style="background:#f4a460; margin-bottom: 50px;">
  Gestisci i tuoi tempi non disponibili
</button>


<div v-if="openUnavailableTimeModal" class="modal" @click.self="closeUnavailableTimeModal">
    <div class="modal-dialog">
      <div class="modal-content" style="background: linear-gradient(to bottom, #f4a460, #eee8aa);">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Gestisci i tuoi tempi non disponibili</h1>
        </div>
        <div class="modal-body">
          <div v-if="unavailableTimes.length > 0">
            <ul>
              <li v-for="(time, index) in unavailableTimes" :key="index">
                <p>Orario di inizio: {{ time.startHour }}:{{ time.startMinute }}</p>
                <p>Orario di fine: {{ time.endHour }}:{{ time.endMinute }}</p>
                <p>Ripetizione giornaliera: {{ time.repeatDaily ? 'Sì' : 'No' }}</p>
                <div v-if="!time.repeatDaily">
                <p>Giorno non disponibile: {{ time.giorno }}</p>
              </div>
                <button type="button" class="btn btn-danger" @click="eliminaUnavailableTime(time._id)">Elimina</button>
              </li>
            </ul>
          </div>
          <p v-else>Non ci sono tempi non disponibili.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeUnavailableTimeModal" style="background:#f4a460;">Chiudi</button>
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
//import { use } from 'marked';

export default {
  setup() {
    const router = useRouter();
    const currentDate = ref(new Date());
    const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const eventsMap = ref({});
    const activityMap = ref({});
    const pomodoroMap = ref({});
    const calendarDays = ref([]);
    const openNotificationModal = ref(false);
    const openUnavailableTimeModal = ref(false);
    const unavailableTimes = ref([]);



    const formData = ref({
  startHour: 0,
  startMinute: 0,
  endHour: 0,
  endMinute: 0,
  repeatDaily: false,
  giorno:"",
});



    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
    });

    function openModal() {
      openNotificationModal.value = true;
    }
    function closeNotificationModal() {
      openNotificationModal.value = false;
    }
    function openUnavailableTimeModalFunction() {
      VediNonDisponibile();
  openUnavailableTimeModal.value = true;
}
function closeUnavailableTimeModal() {
  openUnavailableTimeModal.value = false;
}





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
            return eventDate >= today;
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
            return activityDate >= today; 
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
            return pomodoroDate >= today; 
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


function submitForm() {
  addUnavailableTime(formData.value.startHour, formData.value.startMinute, formData.value.endHour, formData.value.endMinute, formData.value.repeatDaily, formData.value.giorno);
  closeNotificationModal(); 
}


async function VediNonDisponibile() {
    const username = localStorage.getItem('username');
    const token = sessionStorage.getItem('token');
    try {
        const response = await axios.get('/api/nonDisponibileGET', {
            headers: {
                Authorization: `Bearer ${token}` 
            },
            params: { username: username },
        });
        unavailableTimes.value = response.data;
        console.log("unatim",unavailableTimes.value);
    } catch (error) {
        console.log("Errore recupero non disponibile user", error);
    }
}

async function eliminaUnavailableTime(id) {
  console.log(id);
  try {
    const token = sessionStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!token) {
      console.error('Token mancante. L\'utente potrebbe non essere autenticato.');
      return;
    }

    const response = await axios.delete('/api/rimNonDisponibile', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {username:username , id: id } 
    });

    console.log('Tempo non disponibile eliminato con successo:', response.data);

    VediNonDisponibile(); 
  } catch (error) {
    console.error('Errore durante l\'eliminazione del tempo non disponibile:', error);
  }
}




async function addUnavailableTime(startHour, startMinute, endHour, endMinute, repeatDaily,giorno) {
  try {
    const username = localStorage.getItem('username');
    const token = sessionStorage.getItem('token');
    if (!username || !token) {
      console.error('Username o token mancante. L\'utente potrebbe non essere autenticato.');
      return;
    }

    const response = await axios.post(`/api/nonDisponibile`, {
      startHour,
      startMinute,
      endHour,
      endMinute,
      repeatDaily,
      giorno,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Indisponibilità aggiunta con successo:', response.data);
  } catch (error) {
    console.error('Errore durante l\'aggiunta dell\'indisponibilità:', error);
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


    //genera file .ics
    async function generateICS() {
      const username = localStorage.getItem('username');
      const token = sessionStorage.getItem('token');

      const eventResponse = await axios.get(`/api/eventsGET`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { author: username }
      });
      const events = eventResponse.data;

      //console.log("eventss:",events);
      let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SELfie//Calendar//EN\n";

      // eventi iCalendar
      events.forEach(event => {
        if (event.date) {
          icsContent += "BEGIN:EVENT\r\n";
          icsContent += `TITLE:${event.title}\r\n`;
          icsContent += `DESCRIPTION:${event.description || "Nessuna descrizione"}\r\n`;
          icsContent += `LOCATION:${event.location || "N/A"}\r\n`;
          //icsContent += `DTSTART:${formatDateToICS(new Date(event.startDate))}\r\n`;
          icsContent += `DATE:${formatDateToICS(new Date(event.date))}\r\n`;
          icsContent += "CATEGORY:Evento\r\n";
          icsContent += "END:EVENT\r\n";
        }
      });
      //attivita
      // Object.keys(activityMap.value).forEach(dateString => {
      //   const activityDate = new Date(dateString);
      //   icsContent += "BEGIN:VEVENT\n";
      //   icsContent += `UID:${dateString}-activity@yourapp.com\n`;
      //   icsContent += `DTSTAMP:${formatDateToICS(activityDate)}\n`;
      //   icsContent += `DTSTART:${formatDateToICS(activityDate)}\n`;
      //   icsContent += `SUMMARY:Attività\n`;
      //   icsContent += "END:VEVENT\n";
      // });
      // //pomodoro
      // Object.keys(pomodoroMap.value).forEach(dateString => {
      //   const pomodoroDate = new Date(dateString);
      //   icsContent += "BEGIN:VEVENT\n";
      //   icsContent += `UID:${dateString}-pomodoro@yourapp.com\n`;
      //   icsContent += `DTSTAMP:${formatDateToICS(pomodoroDate)}\n`;
      //   icsContent += `DTSTART:${formatDateToICS(pomodoroDate)}\n`;
      //   icsContent += `SUMMARY:Pomodoro\n`;
      //   icsContent += "END:VEVENT\n";
      // });

      icsContent += "END:VCALENDAR";

      // Crea un file blob e scaricalo
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "calendar.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // formatta la data in formato iCalendar
    function formatDateToICS(date) {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
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
      selectDate,
      openNotificationModal,
      openModal,
      closeNotificationModal,
      submitForm,
      formData,
      closeUnavailableTimeModal,  
      openUnavailableTimeModalFunction,
      openUnavailableTimeModal,
      VediNonDisponibile,
      unavailableTimes,
      eliminaUnavailableTime,
      generateICS
    };
  }, 

};
</script>

<style scoped>

.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.fixed-button:nth-of-type(1) {
  bottom: 90px;
}

.fixed-button:nth-of-type(2) {
  bottom: 50px; 
}

.fixed-button:nth-of-type(3) {
  bottom: 20px; 
}
button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button.rounded-btn {
  border-radius: 20px; 
}
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.modal-content {
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
}



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