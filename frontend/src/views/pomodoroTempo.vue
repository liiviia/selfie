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
      <button @click="skipPhase">Salta alla fase successiva</button>
      <button @click="restartCycle">Ricomincia ciclo</button>
      <button @click="endCycle">Termina ciclo</button>
      <button @click="pauseTimer">Stoppa timer</button>
      <button v-if="isPaused" @click="resumeTimer">Riprendi timer</button> <!-- Pulsante per riprendere -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted,  onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();

    const newPom = ref({
      username: localStorage.getItem('username') || 'Guest',
      tempoStudio: 30,  // Default di 30 minuti
      tempoPausa: 5,    // Default di 5 minuti
      ripetizioni: 5,   // Default di 5 cicli
      giorno: ''
    });
   const statusMessage = ref('');
    let studyCycles = ref(parseInt(route.query.studyCycles) || newPom.value.ripetizioni);
    let timerInterval = null;
    let isStudyPhase = ref(route.query.isStudyPhase === 'true');
    let remainingTime = ref(parseInt(route.query.remainingTime) || 0);
    let isPaused = ref(false);

    onMounted(() => {
       if (route.query.date) {
    // Se viene passata una data tramite `route.query.date`, significa che stai riprendendo una sessione
    newPom.value.giorno = new Date(route.query.date).toISOString().split('T')[0];
  } else {
    // Se non viene passata nessuna data, imposta `giorno` a oggi per una nuova sessione
    newPom.value.giorno = new Date().toISOString().split('T')[0];
  }

  // Imposta gli altri parametri necessari per la sessione in corso o ripresa
  remainingTime.value = parseInt(route.query.remainingTime) || 0;
  studyCycles.value = parseInt(route.query.studyCycles) || newPom.value.ripetizioni;
  isStudyPhase.value = route.query.isStudyPhase === 'true';
  newPom.value.tempoStudio = parseInt(route.query.tempoStudio) || newPom.value.tempoStudio;
  newPom.value.tempoPausa = parseInt(route.query.tempoPausa) || newPom.value.tempoPausa;
  newPom.value.ripetizioni = parseInt(route.query.ripetizioni) || newPom.value.ripetizioni;

  // Log di controllo
  console.log("Parametri inizializzati:", {
    giorno: newPom.value.giorno,
    remainingTime: remainingTime.value,
    studyCycles: studyCycles.value,
    isStudyPhase: isStudyPhase.value,
    tempoStudio: newPom.value.tempoStudio,
    tempoPausa: newPom.value.tempoPausa,
    ripetizioni: newPom.value.ripetizioni,
  });

  if (remainingTime.value > 0) {
    document.getElementById('timerDisplay').textContent = formatTime(remainingTime.value);
    if (isStudyPhase.value) {
      startTimerWithRemainingTime();
    } else {
      startBreakTimer(newPom.value.tempoPausa, studyCycles.value);
    }
  }
    });

    onUnmounted(() => {
      clearInterval(timerInterval); 
    });

    const aggiungiPomodoro = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const currentDate = new Date();
        const selectedDate = new Date(newPom.value.giorno);

        const response = await axios.post('/api/pomsPOST', newPom.value, {
          headers: { Authorization: `Bearer ${token}` }
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

      
   const startTimerWithRemainingTime = () => {
      isPaused.value = false;
      clearInterval(timerInterval); // Rim timer precedenti
      timerInterval = setInterval(() => {
      updateTimer(remainingTime.value, newPom.value.tempoStudio, newPom.value.tempoPausa, studyCycles.value, isStudyPhase.value ? startBreakTimer : startStudyTimer);
    }, 1000); 
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

  clearInterval(timerInterval); // Rim timer precedenti
  timerInterval = setInterval(() => {
    updateTimer(remainingTime.value, studyTime, pause, cycles, startBreakTimer);
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

  clearInterval(timerInterval); // Anche qui
  timerInterval = setInterval(() => {
    updateTimer(remainingTime.value, pauseTime, pauseTime, cycles, startStudyTimer);
  }, 1000); 
};

  const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const updateTimer = (remaining, phaseTime, pauseTime, cycles, nextPhase) => {
  if (remaining > 0) {
    document.getElementById('timerDisplay').textContent = formatTime(remaining);
    remainingTime.value = remaining - 1;
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
      saveIncompleteSession();
    };

    const pauseTimer = () => {
      clearInterval(timerInterval);
      isPaused.value = true;
      saveIncompleteSession();
    };

    const resumeTimer = () => {
      isPaused.value = false;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
      updateTimer(remainingTime.value, newPom.value.tempoStudio, newPom.value.tempoPausa, studyCycles.value, isStudyPhase.value ? startBreakTimer : startStudyTimer);
    }, 1000); 
  };

    const saveIncompleteSession = async () => {
      const token = sessionStorage.getItem('token');
      const username = newPom.value.username.trim();

      try {
        await axios.post('/api/poms/save-incomplete', {
          username,
          giorno: new Date(newPom.value.giorno).toISOString(), 
          remainingTime: remainingTime.value,
          isStudyPhase: isStudyPhase.value,
          studyCycles: studyCycles.value,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Incomplete session saved.');
      } catch (error) {
        console.error('Error saving incomplete session:', error);
      }
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
  border-radius: 20px; /* Arrotonda il pulsante */
}

.controls {
  margin-top: 20px;
}

.controls button {
  padding: 10px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.controls button:hover {
  background-color: #0056b3;
}

.controls {
  margin-top: 20px;
  margin-bottom: 40px;
}

#clock {
  margin-top: 40px;
}
</style>






