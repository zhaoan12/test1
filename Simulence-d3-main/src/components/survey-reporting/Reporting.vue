<template>
  <div id='projects-page'>
    <navigator
      class="navigator"
      :flag="navFlag" />
     <div class="graph"  >
      <BarGraph class="graph" v-for="(question, index) in graphQuestions" :key="index" v-bind:idValue="index" :questions="question"></BarGraph>
      <MCGraph class="graph" v-for="(question, index) in MCQuestions" :key="index" v-bind:idValue="index" :questions="question"></MCGraph>
     </div>
  </div>
</template>

<script>
import navigator from '../layout/NavBarOld.vue'
import Firestore from '../../Firestore'
import BarGraph from "./BarGraph";
import MCGraph from "./MCGraph"

export default {
  name: "Templates",
  components: {
    BarGraph,
    navigator,
    MCGraph
  },
  data() {
    return {
      msg: "projects",
      navFlag: 2,
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin,
      graphQuestions:[],
      MCQuestions: []
    }
  },
  mounted() {
    if (window.localStorage.getItem("userType")) {
      this.userType = parseInt(window.localStorage.getItem("userType"));
      this.getSurvey()
    } else {
      this.$router.push({
        name: 'login',
      })
    }
  },
  methods: {
    getSurvey: async function() {
      // retrive survey informations

      const surveyId = this.$route.params.surveyId;
      Firestore.getSurveyContent(surveyId)
      .then(res => {
        const questions = res.data.questionList
        this.graphQuestions = questions.filter((q) => {
          return q.type === 2
        })
        this.MCQuestions = questions.filter((q) => {
          return q.type === 3
        })
      })
      .catch(e => {
        alert(e.error);
      });
    }
  }
}
</script>

<style>
#projects-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: #F5F5F5;
}

::-webkit-scrollbar {
  width: 5px;
  height: 100%;
  border-radius: 10px;
  background: #36393F;
}

::-webkit-scrollbar-thumb {
  width: 5px;
  background: #E9E9EA;
  border-radius: 10px;
}


.graph {
  margin-top: 100px;
  width: 100%;
}

.project-num {
  position: absolute;
  top: 110px;
  left: 46px;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 15px;
  color: #FC7727;
}

.add-new-project {
  position: absolute;
  height: 15px;
  top: 110px;
  right: 46px;
  font-weight: bold;
  font-size: 13px;
  line-height: 15px;
  text-align: right;
  color: #E75B4B;
  cursor: pointer;
}
</style>
