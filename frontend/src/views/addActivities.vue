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
  margin: 50px auto;
  padding: 30px;
  background-color: #15172b;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* ombreggiatura morbida */
  transition: transform 0.3s ease; /* transizione */
  box-sizing: border-box;
}

.activity-form:hover {
  transform: translateY(-5px); /* animazione al passaggio */
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
}

.form-container {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  display: block;
}

.form-input, .form-textarea {
  padding: 12px;
  border: 2px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25); /* effetto focus */
  outline: none;
}

.form-textarea {
  height: 120px;
  resize: none;
}

.submit-button {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease, transform 0.2s;
}

.submit-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.status-message {
  text-align: center;
  margin-top: 20px;
  color: #28a745;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}

.form-input, .form-textarea, .submit-button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* piccolo effetto ombra per gli input e il pulsante */
}

/* Aggiungere un effetto leggero ai contenitori */
.form-group {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-home-link {
  color: #007bff;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.3s ease;
  text-align: left;
}
</style>
