<template>
  <v-app>
    <v-main>
      <Calendar />
    </v-main>
  </v-app>
</template>

<script>
import Calendar from "./components/Calendar"

export default {
  name: "App",

  components: {
    Calendar
  },

  data: () => ({
    //
  })
}
</script>
<style>
#app {
  /* background: url('/images/background.png') no-repeat center center fixed !important; */
  background-size: cover;
  background-color: grey !important;
}
</style>
