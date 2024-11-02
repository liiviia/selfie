<template>
  <div class="note-editor">
    <h1>Modifica Nota</h1>
    <form @submit.prevent="updateNote" class="note-form">
      <div class="form-group">
        <label for="heading">Titolo:</label>
        <input type="text" v-model="note.heading" id="heading" required />
      </div>
      <div class="form-group">
        <label for="content">Contenuto:</label>
        <textarea v-model="note.content" id="content" rows="4" required></textarea>
      </div>
      <div class="form-group checkbox-group">
        <label for="completed">Completata:</label>
        <input type="checkbox" v-model="note.completed" id="completed" />
      </div>
      <div class="button-group">
        <button type="submit" class="update-btn">Aggiorna Nota</button>
        <button type="button" @click="confirmDelete(note._id)" class="delete-btn">Elimina Nota</button>
      </div>
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
        content: '',
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
        const token = sessionStorage.getItem('token');
        const noteId = this.$route.params.id;
        const response = await axios.get(`/api/nota/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.note = response.data;
        console.log('Nota recuperata:', this.note); 
      } catch (error) {
        console.error('Errore nel recupero della nota:', error);
      }
    },



     /*

async updateNote() {
      try {
        const token = sessionStorage.getItem('token');
        const noteId = this.$route.params.id;
        const response = await axios.put(`/api/notes/${noteId}`, this.note, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Nota aggiornata:', response.data);
        this.$router.push('/todo');
      } catch (error) {
        console.error('Errore nell\'aggiornamento della nota:', error);
      }
    },
     */



     async updateNote() {
  try {
    const token = sessionStorage.getItem('token');
    const username = localStorage.getItem('username');
    const noteId = this.$route.params.id;

    // Assicurati che `username` sia incluso nel body della richiesta
    const updatedNoteData = {
      ...this.note,
      username: username  // Aggiungi `username` al body
    };

    const response = await axios.put(`/api/notes/${noteId}`, updatedNoteData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Nota aggiornata:', response.data);
    this.$router.push('/todo');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert('Non autorizzato a modificare la nota');
    } else {
      console.error('Errore nell\'aggiornamento della nota:', error);
    }
  }
},


    confirmDelete(id) {
      if (confirm("Sicuro di voler eliminare questa nota?")) {
        this.deleteNote(id);
      }
    },
    async deleteNote(id) {
  try {
    const token = sessionStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    await axios.delete(`/api/notesRIM/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        username: username // Aggiungi `username` come parametro di query
      }
    });

    console.log('Nota eliminata');
    this.fetchNotes();
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert('Non autorizzato a eliminare la nota');
    } else {
      console.error("Errore nell'eliminazione della nota:", error);
    }
  }
}

  }
};
</script>

<style scoped>
.note-editor {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa; /* Colore sfondo simile alle attività */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #343a40;
}

.note-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: inline-block;
}

input[type="text"],
textarea {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  margin-right: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between; /* Allinea i pulsanti orizzontalmente */
  margin-top: 20px;
}

.update-btn,
.delete-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
  margin: 0 5px;
}

.delete-btn {
  background-color: #dc3545;
}

.update-btn:hover {
  background-color: #0056b3;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>
