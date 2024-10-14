<template>
  <div>
    <h1>Aggiungi una Sessione Pomodoro</h1>
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

      <button type="submit">Aggiungi Sessione</button>
    </form>

    <p id="studio-pausa">{{ statusMessage }}</p>
    <div id="clock" class="blob">
      <div class="timer" id="timerDisplay">00:00</div>
      <div class="progress-bar"></div>
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
      tempoStudio: '',
      tempoPausa: '',
      ripetizioni: '',
      giorno: ''
    });
    const statusMessage = ref('');

    onMounted(() => {
      if (route.query.date) {
        newPom.value.giorno = route.query.date;
      }
    });

    const aggiungiPomodoro = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log('Dati inviati:', newPom.value);

        newPom.value.giorno = newPom.value.giorno ? new Date(newPom.value.giorno).toISOString().split('T')[0] : '';

        const response = await axios.post('/api/pomsPOST', newPom.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Sessione pomodoro aggiunta:', response.data);
        startStudyTimer(newPom.value.tempoStudio, newPom.value.ripetizioni, newPom.value.tempoPausa);
        newPom.value = {
          username: newPom.value.username,
          tempoStudio: '',
          tempoPausa: '',
          ripetizioni: '',
          giorno: route.query.date || ''
        };
      } catch (error) {
        console.error('Errore:', error);
      }
    };

    const startStudyTimer = (studyTime, studyCycles, pause) => {
      statusMessage.value = `Studio! Numero cicli rimanenti: ${studyCycles}`;
      const progressBar = document.querySelector('.progress-bar');
      progressBar.style.width = '0%';

      const startTime = Date.now();
      const endTime = startTime + studyTime * 60000;

      const updateProgressBar = () => {
        const now = Date.now();
        const elapsedTime = now - startTime;
        const progressPercentage = (elapsedTime / (studyTime * 60000)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (now < endTime) {
          const studyDifference = endTime - now;
          const studyMinutes = Math.floor((studyDifference % (1000 * 60 * 60)) / (1000 * 60));
          const studySeconds = Math.floor((studyDifference % (1000 * 60)) / 1000);
          document.getElementById('timerDisplay').textContent = `${String(studyMinutes).padStart(2, '0')}:${String(studySeconds).padStart(2, '0')}`;
          requestAnimationFrame(updateProgressBar);
        } else {
          progressBar.style.width = '0%';
          startBreakTimer(pause, studyCycles);
        }
      };

      updateProgressBar();
    };

    const startBreakTimer = (pause, studyCycles) => {
      statusMessage.value = `Pausa! Numero cicli rimanenti: ${studyCycles}`;
      const progressBar = document.querySelector('.progress-bar');
      progressBar.style.width = '0%';

      const startTime = Date.now();
      const endTime = startTime + pause * 60000;

      const updateProgressBar = () => {
        const now = Date.now();
        const elapsedTime = now - startTime;
        const progressPercentage = (elapsedTime / (pause * 60000)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (now < endTime) {
          const breakDifference = endTime - now;
          const breakMinutes = Math.floor((breakDifference % (1000 * 60 * 60)) / (1000 * 60));
          const breakSeconds = Math.floor((breakDifference % (1000 * 60)) / 1000);
          document.getElementById('timerDisplay').textContent = `${String(breakMinutes).padStart(2, '0')}:${String(breakSeconds).padStart(2, '0')}`;
          requestAnimationFrame(updateProgressBar);
        } else {
          progressBar.style.width = '0%';
          studyCycles--;
          if (studyCycles > 0) {
            startStudyTimer(newPom.value.tempoStudio, studyCycles, pause);
          } else {
            statusMessage.value = `Finito! Cicli rimanenti: ${studyCycles}`;
            document.getElementById('timerDisplay').textContent = "";
          }
        }
      };

      updateProgressBar();
    };

    return {
      newPom,
      statusMessage,
      aggiungiPomodoro
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
  transition: width 0.5s;
}

.timer {
  font-size: 2em;
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
</style>
