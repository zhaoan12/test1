<template>
  <div>
    <h4><strong>Question:</strong>"{{this.questions.content}}"</h4>
    <canvas :id="'mc'+this.idValue"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Firestore from '../../Firestore'
export default {
  name: "MCGraph",
  components: {
  },
  props: ['idValue', "questions"],
  data() {
    return {
      mc_answers: [],
      options: []
    }
  },
  mounted() {
    this.getAnswers()
  },
  methods: {
    getAnswers: function() {
      Firestore.getAnswers(this.$route.params.surveyId, this.questions._id)
      .then(res => {
          this.answer = res.map(a => a.content);
      })
      .catch(e => console.log(e));
      this.options = this.questions.options
      const DATA_COUNT = 5;
      const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

      const counts = this.parseAnswer(answers)
      console.log(counts)
      const data = {
        labels: this.options,
        datasets: [
          {
            label: "Answers for the question: " + this.questions.content,
            data: counts,
            backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
            ],
          }
        ]
      };
      const config = {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: "Answers for the question: " + this.questions.content
            }
          }
        },
      };
      const ctx = document.getElementById('mc'+this.idValue);
      new Chart(ctx, config);
      console.log("done");
      

    },
    parseAnswer(answer) {
        let counts = []

        for (let i = 0; i < this.options.length; i++)
        {
          counts.push(0)
        }
        console.log(counts)
        for (let i = 0; i < answer.length; i++)
        {
          counts[this.options.indexOf(answer[i])] += 1
        }
        console.log(counts)
        return counts
      }
  }
}

</script>

<style>
</style>
