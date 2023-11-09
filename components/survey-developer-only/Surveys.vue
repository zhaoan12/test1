<template>
  <div class="d-flex">
    <navigator />
    <div class="surveys-container">
      <div class="title-header">
        <h1> Surveys </h1>
      </div>
      <div class="inner-surveys-container">
        <SearchSurveys></SearchSurveys>
      </div>
    </div>
  </div>
</template>
    
<script>
import navigator from '../layout/NavBarNew.vue';
import SearchSurveys from './SearchSurveys.vue';

export default {
  name: 'Surveys',
  components: {
    navigator,
    SearchSurveys,
  },
  data() {
    return {
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1, // 0: Tester, 1: Company, 2: Admin
      userId: window.localStorage.getItem('userId'),
    }
  },
  mounted() {
    if (window.localStorage.getItem("userType") && window.localStorage.getItem("userId")) {
      this.userType = parseInt(window.localStorage.getItem("userType"));
      this.userId = window.localStorage.getItem("userId");
    } else {
      window.localStorage.getItem("userId");
      this.$router.push({
        name: 'login',
      })
    }
  },
  methods: {
    addProject: function () {
      this.$router.push({
        name: 'createSurvey',
      })
    }
  }
}
</script>
    
<style scoped>
.surveys-container {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  margin: 0px 0px 0px auto;
  background-color: #EEEEEE;
}

.title-header {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90px;
  width: 100%;
}

.title-header h1 {
  color: #FF7222;
  font-weight: bold;
}

h4 {
  color: #FF7222;
  font-weight: bold;
  margin: 1rem 0px;
}

.inner-surveys-container {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
}

.add-new-project {
  color: #FF7222;
  align-self: flex-end;
  margin: 1rem;
  margin-bottom: 0rem;
  cursor: pointer;
}
</style>
      