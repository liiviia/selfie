<template>
  <div id="App">
    <AppNavbar />
    <router-view/>
    <AppFooter />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';


export default {
  name: 'App', 
   components: {
    AppNavbar,
    AppFooter,
  },
}; 
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(90deg, #525169, #776BCC);
}
</style>
