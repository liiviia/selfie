<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">←</button>
      <div class="year-month-display">
        <div class="year">{{ currentYear }}</div>
        <div class="month">{{ monthNames[currentMonth] }}</div>
      </div>
      <button @click="nextMonth">→</button>
    </div>

    <div class="calendar-weekdays">
      <div v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>

    <div class="calendar-grid">
      <div v-for="emptyDay in emptyDays" :key="emptyDay" class="empty-day"></div>
      <div v-for="day in daysInMonth" :key="day" class="calendar-day" 
           :class="{ 'current-day': isToday(day), 'sunday': isSunday(day) }" 
           @click="handleDayClick(day)">
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      monthNames: [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
      ],
      weekdays: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
    };
  },
  computed: {
    daysInMonth() {
      return new Array(new Date(this.currentYear, this.currentMonth + 1, 0).getDate()).fill(null).map((_, i) => i + 1);
    },
    emptyDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      return new Array(firstDay === 0 ? 6 : firstDay - 1).fill(null);
    }
  },
  methods: {
    isToday(day) {
      const today = new Date();
      return (
        day === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear()
      );
    },
    isSunday(day) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      return date.getDay() === 0;
    },
    prevMonth() {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
    },
    nextMonth() {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
    },
    handleDayClick(day) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      console.log('Hai cliccato sulla data:', date);
    }
  }
};
</script>

<style scoped>

.custom-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.calendar {
  width: 500px;
  margin: 0 auto;
  text-align: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.year-month-display {
  text-align: center;
}

.year {
  font-size: 2em;
}

.month {
  font-size: 1.5em;
}

.calendar-weekdays,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.calendar-weekdays div {
  font-weight: bold;
  padding: 10px 0;
}

.calendar-day {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.calendar-day:hover {
  background-color: #d4edda;
}

.current-day {
  border-color: red;
  border-width: 3px;
  border-radius: 10px;
}

.empty-day {
  visibility: hidden;
}

.sunday {
  font-weight: bold;
}
</style>
