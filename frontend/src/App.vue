<template>
  <div id="App">
    <!-- Navbar, visibile solo se non siamo nella schermata di login -->
    <Nav v-if="!isLoginPage" />
    <router-view/>
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
    //verifico se sono nella pagina di login
    isLoginPage(){
      return this.$route.path==='/';
    }
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
