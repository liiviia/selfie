<template>
  <div class="activity-form">
    <h1>Aggiungi una nuova attività</h1>
    <form @submit.prevent="submitActivity" class="form-container">
      <div class="form-group">
        <label for="title">Titolo:</label>
        <input v-model="newActivity.title" id="title" required class="form-input">
      </div>
      
      <div class="form-group">
        <label for="description">Descrizione:</label>
        <textarea v-model="newActivity.description" id="description" class="form-textarea"></textarea>
      </div>
      
      <div class="form-group">
        <label for="deadline">Scadenza:</label>
        <input v-model="newActivity.deadline" type="date" id="deadline" required class="form-input">
      </div>
      
      <button type="submit" class="submit-button">Aggiungi Attività</button>
    </form>

    <p v-if="message" class="status-message">{{ message }}</p>
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
        email: localStorage.getItem('email') || '',
        completed: false
      },
      message: ''
    };
  },
  methods: {
    async submitActivity() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post('/api/activities', this.newActivity, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Attività aggiunta:', response.data);
        
        this.newActivity = { 
          title: '',
          description: '',
          deadline: '',
          author: this.newActivity.author,
          email: this.newActivity.email,
          completed: false
        };
        
        this.message = 'Attività aggiunta con successo!';
        this.$router.push('/homePrincipale'); 
      } catch (error) {
        this.message = 'Errore: ' + error;
        console.error('Errore:', error);
      }
    }
  }
};
</script>

<style scoped>
.activity-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-input, .form-textarea {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}

.form-textarea {
  height: 100px;
  resize: none;
}

.submit-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}

.status-message {
  text-align: center;
  margin-top: 20px;
  color: green;
}
</style>
