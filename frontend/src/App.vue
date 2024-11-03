<template>
  <div id="App">
    <Nav v-if="!isLoginPage" />
    
    <div class="container">
      <router-view/>
    </div>
    
    <AppFooter v-if="!isLoginPage"/>
  </div>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import Nav from './components/NavigationBar.vue';

export default {
  name: 'App', 
  components: {
    Nav,
    AppFooter,
  },
  computed:{
    isLoginPage(){
      return this.$route.path === '/';
    }
  },
}; 
</script>

<style>

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#App {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
}

.container {
  flex: 1; 
}

</style>
