<template>
  <div>
    <h1>Aggiungi una nuova attività</h1>
    <form @submit.prevent="submitActivity">
      <div>
        <label for="title">Titolo:</label>
        <input v-model="newActivity.title" id="title" required>
      </div>
      
      <div>
        <label for="description">Descrizione:</label>
        <textarea v-model="newActivity.description" id="description"></textarea>
      </div>
      
      <div>
        <label for="deadline">Scadenza:</label>
        <input v-model="newActivity.deadline" type="date" id="deadline" required>
      </div>
      
      <button type="submit">Aggiungi Attività</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newActivity: {
        title: '',
        description: '',
        deadline: '',
        author: localStorage.getItem('username') || 'Guest',
        completed: false
      },
      message: ''
    };
  },
  methods: {
    async submitActivity() {
      try {
        const response = await axios.post('/api/activities', this.newActivity);
        console.log('Attività aggiunta:', response.data);
        
        this.newActivity = { 
          title: '',
          description: '',
          deadline: '',
          author: this.newActivity.author,
          completed: false
        };
        
        this.message = 'Attività aggiunta con successo!';
      } catch (error) {
        this.message = error;
        console.error('Errore:', error);
      }
    }
  }
};
</script>

<style scoped>

</style>
