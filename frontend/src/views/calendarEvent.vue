<template>
    <div class="test-page">
      <h1>Pagina di Prova</h1>
      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}: {{ item.description }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TestPage',
    data() {
      return {
        items: [
          { id: 1, name: 'Elemento 1' },
          { id: 2, name: 'Elemento 2'},
          { id: 3, name: 'Elemento 3'},
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .test-page {
    text-align: center;
    font-family: Arial, sans-serif;
  }
  .test-page h1 {
    color: #42b983;
  }
  .test-page ul {
    list-style-type: none;
    padding: 0;
  }
  .test-page li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  </style>
  