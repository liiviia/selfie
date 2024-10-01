<template>
  <div>
    <h1>Sessioni Pomodoro Salvate</h1>
    <div v-if="poms.length > 0">
      <ul>
        <li v-for="pom in poms" :key="pom._id">
          <p><strong>Username:</strong> {{ pom.username }}</p>
          <p><strong>Tempo di Studio:</strong> {{ pom.tempoStudio }} minuti</p>
          <p><strong>Tempo di Pausa:</strong> {{ pom.tempoPausa }} minuti</p>
          <p><strong>Ripetizioni:</strong> {{ pom.ripetizioni }}</p>
          <hr>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Non ci sono sessioni Pomodoro salvate al momento.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      poms: [] 
    };
  },
  async created() {
    await this.getPoms(); 
  },
  methods: {
    async getPoms() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username'); 
        const response = await axios.get('/api/poms', {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params: { username: username }
        });
        this.poms = response.data; 
      } catch (error) {
        console.error('Errore durante il recupero delle sessioni Pomodoro:', error);
      }
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}

hr {
  margin-top: 10px;
}
</style>
