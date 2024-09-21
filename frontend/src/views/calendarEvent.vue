<template>
  <div>
    <h1>Calendario</h1>
    <vue-cal
      :events="events"
      @click-date="handleDateClick"
    />
  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css'; 

export default {
  components: {
    VueCal
  },
  data() {
    return {
      events: []
    };
  },
  methods: {
    handleDateClick(date) {
      console.log('Hai cliccato sulla data:', date);
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
