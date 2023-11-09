<template>
  <!-- survey form with given question -->
  <div>
    <div>
      {{updateColor()}}
    </div>
    <div>
      <transition name="fade">
        <Loading v-if="isLoading"></Loading>
      </transition>
    </div>
    <div id='questions-wrapper' :style="{color: 'white', display: 'block'}" class="overflow-auto" v-if="userType==1">
      <div class='questions-viewer-body'>

          <div class="question-content" v-for="(question, qIndex) in this.questionList" :key="qIndex">
            <div >{{qIndex + 1 }}. {{question.content}}</div>
            <b-button v-if="isEditable" class="remove-button" v-on:click="() => {removeQuestion(question.id)}">Remove Q{{qIndex + 1 }}.</b-button>
          </div>

      </div>
    </div>
  </div>
</template>

<script>
import Firestore from '../../Firestore'
import Loading from "../loading";
export default {
  name: "SurveyTemplate",
  components: {
    Loading
  },
  props: {
    questions: {
      type: Array,
      default: function () {
        return []
      }
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    userType: {
      type: Number,
      default: 1
    },

  },
  watch: {
    questions: function(newVal, oldVal) {
      this.getQuestions()
    }
  },
  data() {
    return {
      currEdit: Number,
      editText: String,
      show: false,
      questionList: [],
      isLoading: false
    }
  },
  mounted() {
    this.getQuestions()
  },
  methods: {
    getQuestions: function() {
      this.isLoading = true
      Firestore.getQuestions(this.questions)
      .then(res => {
        this.questionList = res.data
        this.isLoading = false
      })
      .catch(error => {
        console.log(error);
      });
    },
    removeQuestion(questionID) {
      this.$emit("removeQuestion", questionID)
    },

    updateColor: function() {
        var r = document.querySelector(':root');
        r.style.setProperty('--QUESTIONS_WRAPPER_BACKGROUND', this.$store.state.questionsWrapper_background);
               
    },
  }
}
</script>

<style>
:root {
    --QUESTIONS_WRAPPER_BACKGROUND: #fbfbfb;
   
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
#questions-wrapper {
  width: 100%;
  height: 80%;
  background: var(--QUESTIONS_WRAPPER_BACKGROUND);
  border-radius: 10px;
}
#survey-selector {
  width: 18%;
  height: 80%;
  margin-top: 100px;
  margin-left: 1%;
  background: rgba(132, 132, 132, 0.5);
  border-radius: 10px;
  color: #E9E9EA
}
.questions-viewer-body {
  margin: 2rem;
}
.edit {
  margin-left: auto;
  margin-right: 0;
  float: right;
}

.question-content {
  color:black;
  margin-bottom: 10px;
  display: inline;
}

.remove-button {
  margin-left: auto;
  margin-right: 0;
  background: #FC7727;
}
</style>
