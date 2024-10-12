<template>
  <div>
    <h1>Aggiungi una Nota</h1>
    <form @submit.prevent="addNote">
      <div>
        <label for="heading">Titolo:</label>
        <input type="text" v-model="newNote.heading" id="heading" required />
      </div>
      <div>
        <label for="content">Contenuto:</label>
        <textarea v-model="newNote.content" id="content" rows="4"></textarea>
      </div>
      <button type="submit">Aggiungi Nota</button>
    </form>

    <h1>Notes</h1>
    <ul class="notes-list">
      <li v-for="note in notes" :key="note._id" class="note-item">
        <h2>{{ note.heading }}</h2>
        <div class="note-content" v-html="renderMarkdown(note.content)"></div>
        <p>Author: {{ note.author }}</p>
        <div class="note-actions">
          <button @click="editNote(note._id)">Modifica</button>
          <button @click="deleteNote(note._id)">Elimina</button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  
  import axios from 'axios';
import {marked} from 'marked';

export default {
  data() {
    return {
      newNote: {
        heading: '',
        content: ''
      },
      notes: []
    };
  },
  async created() {
    this.fetchNotes();
  },
  methods: {
    async fetchNotes() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username'); 
        if (!username) {
          console.error('Username non trovato');
          return;
        }
        const response = await axios.get('/api/notesGET', {
          params: { username: username },
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        this.notes = response.data;
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    },
    async addNote() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!username) {
          console.error('Username non trovato, impossibile creare la nota');
          return;
        }

        this.newNote.author = username;

        const response = await axios.post('/api/notes', this.newNote, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Nota aggiunta:', response.data);

        this.newNote = {
          heading: '',
          content: '',
          author: username,
          completed: false
        };

        this.fetchNotes();
      } catch (error) {
        console.error('Errore nell\'aggiunta della nota:', error);
      }
    },
    editNote(id) {
      this.$router.push(`/edit-note/${id}`);
    },
    async deleteNote(id) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`/api/notesRIM/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Nota eliminata');
        this.fetchNotes();
      } catch (error) {
        console.error('Errore nell\'eliminazione della nota:', error);
      }
    },
    
    renderMarkdown(content) {
      if (!content) return '';
      return marked(content);
    }
  }
};
</script>

<style scoped>


div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f3f4f6, #e2e6ea);
  border-radius: 10px; 
  padding: 20px;
}

form {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

form div {
  margin-bottom: 15px;
}

form label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

form input[type="text"],
form input[type="checkbox"],
form textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

form input[type="checkbox"] {
  width: auto;
}

form textarea {
  resize: vertical;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 600px;
}

li {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-size: 18px;
}

p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
}

button:hover {
  background-color: #0056b3;
}

button:nth-of-type(2) {
  background-color: #dc3545;
}

button:nth-of-type(2):hover {
  background-color: #c82333;
}


.notes-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 800px;
}

.note-item {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.note-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.note-content h1 {
  font-size: 24px;
  margin-top: 0;
}

.note-content h2 {
  font-size: 20px;
}

.note-content h3 {
  font-size: 18px;
}

.note-content ul, .note-content ol {
  padding-left: 20px;
}

.note-content pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.note-content code {
  font-family: monospace;
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
}

.note-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.note-actions button {
  margin-left: 10px;
}

</style>
