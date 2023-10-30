<script>
import TextAnswerAccordionItem from "./TextAnswerAccordionItem.vue";
//import 'bootstrap/dist/js/bootstrap.js';

export default {
  props: {
    textAnswers: {
      type: Array, // Make this an array of your text answers, with userId, answerText, and question number.
      default() {
        return [
          {
            userId: "Grunkle Stan",
            questionNumber: 117,
            answerText: "I really liked it, but I thought it could have used more crime and general evilness. I mean, that's why I play video games!\n"
          },
          {
            userId: "Bill Cipher",
            questionNumber: 131,
            answerText: "I enjoyed rearranging the orifices on people's faces. Great human simulator!\n"
          },
          {
            userId: "Light Yagami",
            questionNumber: 132,
            answerText: "This game is rotten, it needs the hand of a God to be cleansed.\n"
          },
          {
            userId: "Peter Griffin",
            questionNumber: 133,
            answerText: "Holy crap Lois, this game is even worse than that time I went to Poland on September 1st, 1939.\n"
          }
        ]
      }
    }
  },
  components: {
    TextAnswerAccordionItem
  }
}

</script>

<!-- This is gonna sound weird, but importing the CSS in <script> will break our component tests because the library jest will
 try to parse the .css as .js and fail. Just link them, trust! -->
<template>
  <div>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <div class="accordion" id="user_id_question_id_accordion">
      Answers:
      <TextAnswerAccordionItem v-for="(answer, index) in textAnswers" :key="answer.userId" :user-answer="answer.answerText" :user-id="answer.userId"
                               :question-number="answer.questionNumber" :start-expanded="index === 0"/>
    </div>
  </div>
</template>

