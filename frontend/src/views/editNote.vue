<template>
    <div>
      <h1>Modifica Nota</h1>
      <form @submit.prevent="updateNote">
        <div>
          <label for="heading">Titolo:</label>
          <input type="text" v-model="note.heading" id="heading" required />
        </div>
        <div>
          <label for="completed">Completata:</label>
          <input type="checkbox" v-model="note.completed" id="completed" />
        </div>
        <button type="submit">Aggiorna Nota</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        note: {
          heading: '',
          completed: false
        }
      };
    },
    async created() {
      await this.fetchNote();
    },
    methods: {
      async fetchNote() {
        try {
          const noteId = this.$route.params.id;
          const response = await axios.get(`/api/nota/${noteId}`);
          this.note = response.data;
          console.log('Nota recuperata:', this.note); 
         // this.$router.push('/todo');
        } catch (error) {
          console.error('Errore nel recupero della nota:', error);
        }
      },
      async updateNote() {
        try {
          const noteId = this.$route.params.id;
          const response = await axios.put(`/api/notes/${noteId}`, this.note);
          console.log('Nota aggiornata:', response.data);
          this.$router.push('/todo');
        } catch (error) {
          console.error('Errore nell\'aggiornamento della nota:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
div {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  margin: 40px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
}

input[type="text"],
input[type="checkbox"] {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: center;
}

button:hover {
  background-color: #0056b3;
}
</style>