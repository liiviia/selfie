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

        const response = await axios.post('/api/pomsPOST', newPom.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Sessione pomodoro aggiunta:', response.data);
        newPom.value = {
          username: newPom.value.username,
          tempoStudio: '',
          tempoPausa: '',
          ripetizioni: '',
          giorno: ''
        };

        startStudyTimer(parseInt(response.data.tempoStudio), parseInt(response.data.ripetizioni), parseInt(response.data.tempoPausa));
      } catch (error) {
        console.error('Errore:', error);
      }
    };

    const startStudyTimer = (studyTime, studyCycles, pause) => {
      statusMessage.value = `Studio! Numero cicli rimanenti: ${studyCycles}`;
      const progressBar = document.querySelector('.progress-bar');
      progressBar.style.width = '0%';

      let remainingTime = studyTime * 60; // convert study time to seconds

      const updateTimer = () => {
        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          remainingTime--;

          const progressPercentage = ((studyTime * 60 - remainingTime) / (studyTime * 60)) * 100;
          progressBar.style.width = `${progressPercentage}%`;
          setTimeout(updateTimer, 1000);
        } else {
          progressBar.style.width = '0%';
          startBreakTimer(pause, studyCycles);
        }
      };

      updateTimer();
    };

    const startBreakTimer = (pause, studyCycles) => {
      statusMessage.value = `Pausa! Numero cicli rimanenti: ${studyCycles}`;
      const progressBar = document.querySelector('.progress-bar');
      progressBar.style.width = '0%';

      let remainingTime = pause * 60; // convert pause time to seconds

      const updateTimer = () => {
        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          remainingTime--;

          const progressPercentage = ((pause * 60 - remainingTime) / (pause * 60)) * 100;
          progressBar.style.width = `${progressPercentage}%`;
          setTimeout(updateTimer, 1000);
        } else {
          progressBar.style.width = '0%';
          studyCycles--;
          if (studyCycles > 0) {
            startStudyTimer(newPom.value.tempoStudio, studyCycles, pause);
          } else {
            statusMessage.value = `Finito! Cicli rimanenti: ${studyCycles}`;
            document.getElementById('timerDisplay').textContent = "00:00";
          }
        }
      };

      updateTimer();
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
</style>