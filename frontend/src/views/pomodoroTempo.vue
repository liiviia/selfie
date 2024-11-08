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

    <div class="timer" id="timerDisplay">00:00</div>

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
import { ref, onMounted,  onUnmounted } from 'vue';
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
    let studyCycles = ref(parseInt(route.query.studyCycles) || newPom.value.ripetizioni);
    let timerInterval = null;
    let isStudyPhase = ref(route.query.isStudyPhase === 'true');
    let remainingTime = ref(parseInt(route.query.remainingTime) || 0);
    let isPaused = ref(false);
    const progressWidth = ref(0);

    onMounted(() => {
       if (route.query.date) {
        newPom.value.giorno = new Date(route.query.date).toISOString().split('T')[0];
      } else {
        newPom.value.giorno = new Date().toISOString().split('T')[0];
      }

      remainingTime.value = parseInt(route.query.remainingTime) || 0;
      studyCycles.value = parseInt(route.query.studyCycles) || newPom.value.ripetizioni;
      isStudyPhase.value = route.query.isStudyPhase === 'true';
      newPom.value.tempoStudio = parseInt(route.query.tempoStudio) || newPom.value.tempoStudio;
      newPom.value.tempoPausa = parseInt(route.query.tempoPausa) || newPom.value.tempoPausa;
      newPom.value.ripetizioni = parseInt(route.query.ripetizioni) || newPom.value.ripetizioni;

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


    const updateProgressBar = (totalTime) => {
      const percentage = ((totalTime - remainingTime.value) / totalTime) * 100;
      progressWidth.value = Math.min(percentage, 100);
    };


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
      clearInterval(timerInterval);
      const totalTime = isStudyPhase.value ? newPom.value.tempoStudio * 60 : newPom.value.tempoPausa * 60;
      timerInterval = setInterval(() => {
        updateTimer(totalTime);
      }, 1000);
    };

    const startStudyTimer = (studyTime, cycles) => {
      if (cycles <= 0) {
        alert('Ciclo completato!');
        return;
      }
      statusMessage.value = `Studio! Numero cicli rimanenti: ${cycles}`;
      remainingTime.value = studyTime * 60;
      isStudyPhase.value = true;
      isPaused.value = false;
      progressWidth.value = 0;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        updateTimer(studyTime * 60);
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
      progressWidth.value = 0;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        updateTimer(pauseTime * 60);
      }, 1000);
    };
    
    const updateTimer = (totalTime) => {
      if (remainingTime.value > 0) {
        remainingTime.value -= 1;
        document.getElementById('timerDisplay').textContent = formatTime(remainingTime.value);
        updateProgressBar(totalTime);
      } else {
        clearInterval(timerInterval);
        studyCycles.value--;
        if (isStudyPhase.value) {
          startBreakTimer(newPom.value.tempoPausa, studyCycles.value);
        } else {
          startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
        }
      }
    };

    const formatTime = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };


    const skipPhase = () => {
      clearInterval(timerInterval);
      progressWidth.value = 0;

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
      progressWidth.value = 0;
      startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
    };

    const endCycle = () => {
      clearInterval(timerInterval);
      studyCycles.value = 0;
      progressWidth.value = 0;
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
      const totalTime = isStudyPhase.value ? newPom.value.tempoStudio * 60 : newPom.value.tempoPausa * 60;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
      updateTimer(totalTime);
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
      isPaused, 
      progressWidth
    };
  }
};
</script>


<style scoped>
#clock {
  margin-top: 20px;
}

.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0; 
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background-color: green;
  width: 0%;
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
