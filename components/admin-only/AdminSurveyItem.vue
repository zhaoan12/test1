<template>
    <div class='admin-survey-card'>
      <div>
            {{updateColor()}}
      </div>
      <b-card
        tag="article"
        style="max-width: 20rem;"
        class="mb-2 card-color"
      >
        <b-card-text>
          <strong>Survey Name</strong>: {{this.name}}<br />
          <strong>Game ID</strong>: {{this.gameID}} <br />
          <strong>Number of Testers</strong>: {{this.numTesters}}<br />
          <strong>Number of Questions</strong>: {{this.numQuestions}} <br />
        </b-card-text>
  
        <b-button href="#" variant="danger" v-on:click="() => {removeSurvey(surveyID)}">Delete</b-button>
        <b-button v-b-modal="this.surveyID">View</b-button>
  
        <b-modal v-bind:id="this.surveyID" title="Questions">
          <AdminViewSurveyQuestions 
          :questionIDs="this.questionIDs"
          />
        </b-modal>
      </b-card>
  </div>
  
  </template>
  
  <script>
  import AdminViewSurveyQuestions from "./AdminViewSurveyQuestions.vue"
  export default {
    name: "AdminSurveyItem",
    components: {
      AdminViewSurveyQuestions
    },
    props: {
      gameID: '',
      numTesters: 0,
      name: "",
      numQuestions: 0,
      surveyID: "",
      questionIDs: []
    },
    data() {
      return {
        userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
      }
    },
    mounted() {
      this.userType = parseInt(window.localStorage.getItem("userType"));
    },
    methods: {
      removeSurvey(surveyID) {
          console.log(surveyID)
          this.$emit("removeSurvey",surveyID)
      },
      updateColor: function() {
          var r = document.querySelector(':root');
          r.style.setProperty('--CARDBK', this.$store.state.cardbk);
      },
    }
  }
  </script>
  
  <style>
  :root {
  --CARDBK: #fbfbfb;
  }
  .admin-survey-card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: rgb(255, 255, 255);
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, .125);
    border-radius: 0.25rem;
    min-width: 150px;
    margin-left: 5px;
  }
  .card-color {
    background: var(--CARDBK);
  }
  </style>
  