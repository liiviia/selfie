<template>
  <div class="event-form">
    <h1>Sessione Pomodoro</h1>
    <form @submit.prevent="aggiungiPomodoro">
      <div>
        <label for="tempoStudio">Tempo di studio (minuti):</label>
        <input type="number" v-model="newPom.tempoStudio" min="1" required>
      </div>

      <div>
        <label for="tempoPausa">Tempo di pausa (minuti):</label>
        <input type="number" v-model="newPom.tempoPausa" min="1" required>
      </div>

      <div>
        <label for="ripetizioni">Numero di ripetizioni:</label>
        <input type="number" v-model="newPom.ripetizioni" min="1" required>
      </div>

      <div>
        <label for="giorno">Giorno della sessione:</label>
        <input type="date" v-model="newPom.giorno" required>
      </div>

      <button type="submit" class="rounded-btn">Aggiungi Sessione</button>
    </form>

    <p id="studio-pausa">{{ statusMessage }}</p>

    <div id="clock" class="blob">
      <div class="timer" id="timerDisplay">00:00</div>
      <div class="progress-bar"></div>
    </div>

    <div class="controls">
  <div class="button-row">
    <button @click="skipPhase">Salta alla fase successiva</button>
    <button @click="restartCycle">Ricomincia ciclo</button>
  </div>
  <div class="button-row">
    <button @click="endCycle">Termina ciclo</button>
    <button @click="pauseTimer">Stoppa timer</button>
    <button v-if="isPaused" @click="resumeTimer">Riprendi timer</button> 
  </div>
</div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();

    const newPom = ref({
      username: localStorage.getItem('username') || 'Guest',
      tempoStudio: 30,  
      tempoPausa: 5,    
      ripetizioni: 5,  
      giorno: ''
    });
    const statusMessage = ref('');
    let studyCycles = ref(0); 
    let timerInterval = null;
    let isStudyPhase = ref(true); 
    let remainingTime = ref(0); 
    let isPaused = ref(false); 

    onMounted(() => {
      if (route.query.date) {
        newPom.value.giorno = route.query.date;
      }
    });

    const aggiungiPomodoro = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const currentDate = new Date();
        const selectedDate = new Date(newPom.value.giorno);

        const response = await axios.post('/api/pomsPOST', newPom.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Sessione pomodoro aggiunta:', response.data);

        if (selectedDate.getTime() > currentDate.getTime()) {
          statusMessage.value = 'Sessione pomodoro aggiunta per una data futura.';
        } else {
          studyCycles.value = newPom.value.ripetizioni;
          startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
        }
      } catch (error) {
        console.error('Errore:', error);
      }
    };

    const startStudyTimer = (studyTime, cycles, pause) => {
      if (cycles <= 0) {
        alert('Ciclo completato!');
        return;
      }

      statusMessage.value = `Studio! Numero cicli rimanenti: ${cycles}`;
      remainingTime.value = studyTime * 60;
      isStudyPhase.value = true;
      isPaused.value = false;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        updateTimer(remainingTime.value, studyTime, pause, cycles, startBreakTimer);
        remainingTime.value--;
      }, 1000);
    };

    const startBreakTimer = (pauseTime, cycles) => {
      if (cycles <= 0) {
        alert('Ciclo completato!');
        return;
      }

      statusMessage.value = `Pausa! Numero cicli rimanenti: ${cycles}`;
      remainingTime.value = pauseTime * 60;
      isStudyPhase.value = false;
      isPaused.value = false;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        updateTimer(remainingTime.value, pauseTime, pauseTime, cycles, startStudyTimer);
        remainingTime.value--;
      }, 1000);
    };

    const updateTimer = (remaining, phaseTime, pauseTime, cycles, nextPhase) => {
      if (remaining > 0) {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      } else {
        clearInterval(timerInterval);
        studyCycles.value--;
        nextPhase(phaseTime, studyCycles.value);
      }
    };

    const skipPhase = () => {
      clearInterval(timerInterval);

      if (isStudyPhase.value) {
        studyCycles.value--;
        startBreakTimer(newPom.value.tempoPausa, studyCycles.value);
      } else {
        startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
      }

      if (studyCycles.value <= 0) {
        statusMessage.value = "Ciclo completato!";
        document.getElementById('timerDisplay').textContent = "00:00";
      }
    };

    const restartCycle = () => {
      clearInterval(timerInterval);
      studyCycles.value = newPom.value.ripetizioni;
      startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
    };

    const endCycle = () => {
      clearInterval(timerInterval);
      studyCycles.value = 0;
      statusMessage.value = 'Ciclo terminato manualmente.';
      document.getElementById('timerDisplay').textContent = "00:00";
    };

    const pauseTimer = () => {
      clearInterval(timerInterval);
      isPaused.value = true;
    };

    const resumeTimer = () => {
      isPaused.value = false;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        updateTimer(remainingTime.value, newPom.value.tempoStudio, newPom.value.tempoPausa, studyCycles.value, isStudyPhase.value ? startBreakTimer : startStudyTimer);
        remainingTime.value--;
      }, 1000); 
    };

    return {
      newPom,
      statusMessage,
      aggiungiPomodoro,
      skipPhase,
      restartCycle,
      endCycle,
      pauseTimer,
      resumeTimer,
      isPaused
    };
  }
};
</script>

<style scoped>
#clock {
  margin-top: 20px;
}

.progress-bar {
  width: 0;
  height: 20px;
  background-color: green;
  transition: width 1s linear;
}

.timer {
  font-size: 2em;
  text-align: center;
  margin-bottom: 10px;
}

form {
  max-width: 400px;
  margin: auto;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
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


.controls {
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex; 
  flex-wrap: wrap; 
  justify-content: center; 
}

.controls button {
  padding: 10px;
  margin: 10px; 
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.button-row {
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 10px; 
}

.controls button {
  flex: 1; 
  margin-right: 10px; 
}

.controls button:last-child {
  margin-right: 0;
}

#clock {
  margin-top: 40px;
}

@media (max-width: 600px) {
  h1 {
    margin-top: 30px; 
  }

  .controls button {
    margin-right: 10px; 
  }
}



</style>