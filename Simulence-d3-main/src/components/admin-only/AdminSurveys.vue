<template>
  <div class="d-flex">
    <navigator class="navigator" :flag="navFlag" />
    <div class="admin-surveys-container">
      <div class="title-header">
        <h1> Surveys </h1>
      </div>

      <div v-if="!this.projectID" class="noSurveyVisual">
          <img src="../../assets/Not Found.png" class="noSurveyImage">
          <div class="noSurveyText">No surveys found (´；ω；`) </div>
      </div>

      <div id="survey-cards">
        <AdminSurveyItem v-for="temp in this.allSurveys" :key="temp.id" :gameID="temp.gameID"
          :numTesters="temp.numTesters" :name="temp.name" :numQuestions="temp.numQuestions" :surveyID="temp.id"
          :questionIDs="temp.questionIDs" v-on:removeSurvey="removeSurvey" />
      </div>
    </div>
  </div>
</template>

<script>
import navigator from '../layout/NavBarNew.vue'
import AdminSurveyItem from "./AdminSurveyItem";
// import Firestore from '../../Firestore'
import Surveys from "../../Firestore/Surveys"
import Template from "../../Firestore/Template";
export default {
  name: "AdminSurveys",
  components: {
    AdminSurveyItem,
    navigator
  },
  data() {
    return {
      msg: "adminsurveys",
      navFlag: 3,
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin,
      allSurveys: []
    }
  },
  mounted() {
    if (window.localStorage.getItem("userType")) {
      this.userType = parseInt(window.localStorage.getItem("userType"));
      this.getSurveys()
    } else {
      this.$router.push({
        name: 'login',
      })
    }
  },
  methods: {
    getSurveys() {
      Surveys.getAllSurveys()
        .then(res => {
          console.log(res.data)
          this.allSurveys = res.data.map(temp => {
            return {
              id: temp.id,
              gameID: temp.gameID,
              numTesters: temp.testerIDs.length,
              name: temp.name,
              numQuestions: temp.questionIDs.length,
              questionIDs: temp.questionIDs
            }
          })
        })
    },
    removeSurvey(surveyID) {
      Template.deleteSurvey(surveyID)
        .then(res => {
          this.getSurveys();
        })
        .catch(e => { // request failure handler
          alert(error.error);
          console.log(error);
        });
    }
  }
}
</script>

<style>
.admin-surveys-container {
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
#survey-cards {
  padding-top: 80px;
  display: flex;
  justify-content: center;
  color: black;
  flex-wrap: wrap;
}

.noSurveyVisual {
  display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-top: 10%;
}
.noSurveyText {
    width: 209px;
    height: 18px;
    margin-left: -67px;
    margin-top: 9px;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
    color: #C4C2C2;
}
.noSurveyImage {
  width: 10%;
}

</style>
