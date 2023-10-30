<template>
  <div id="app">
    <link href='http://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
    <router-view/>
  </div>
</template>

<script>
  import dashboard from './components/game-dashboard/Projects.vue'
  import login from './components/layout/Login.vue'
  export default {
    name: 'App',
    components: {
      dashboard,
      login
    }
  }
</script>

<style>
#app {
  font-family: 'Lato', sans-serif;
  font-style: normal;
  font-weight: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fade-leave-active {
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 0.5s;
}

</style>
