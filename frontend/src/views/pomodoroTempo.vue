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

      <button type="submit">Aggiungi Sessione</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newPom: {
        username: localStorage.getItem('username') || 'Guest',
        tempoStudio: '',
        tempoPausa: '',
        ripetizioni: ''
      }
    };
  },
  methods: {
    async aggiungiPomodoro() {
      try {
        const response = await axios.post('/api/poms', this.newPom);
        console.log('Sessione pomodoro aggiunta:', response.data);
        this.newPom = { 
          username: this.newPom.username, 
          tempoStudio: '', 
          tempoPausa: '', 
          ripetizioni: ''
        };
      } catch (error) {
        console.error('Errore:', error);
      }
    }
  }
};
</script>

<style scoped>
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
