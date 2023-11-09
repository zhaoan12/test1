<template>
    <div>
        <div class="question-content" v-for="(question, qIndex) in this.questions" :key="qIndex">
            <div><div class="badge">Q{{qIndex + 1 }}</div> {{question.content}}</div>
        </div>
    </div>
</template>

<script>
import Firestore from '../../Firestore';
export default {
  name: "AdminViewSurveyQuestions",
  props: {
    questionIDs: []
  },
  data() {
    return {
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin,
      questions: []
    }
  },
  mounted() {
    this.userType = parseInt(window.localStorage.getItem("userType"));
    this.showQuestions(this.questionIDs)
  },
  methods: {
    showQuestions(questionIDs) {
        Firestore.getQuestions(this.questionIDs)
        .then(res => {
          this.questions = res.data
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
}
</script>

<style>
.badge{
    background-color: rgb(241, 95, 50);
    color: white;
}
</style>