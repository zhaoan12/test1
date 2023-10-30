<template>
    <div class="barGraph">
      <h4><strong>Question:</strong>"{{this.questions.content}}"</h4>
      <canvas v-bind:id = "this.idValue"></canvas>
    </div>
  </template>
  
  <script>
  import navigator from '../layout/NavBarOld.vue'
  import Chart from 'chart.js'
  import Firestore from '../../Firestore'
  export default {
    name: "BarGraph",
    components: {
      navigator
    },
    props: ['idValue', "questions"],
    data() {
      return {
        answers: [],
        chartData: {
          type: "bar",
          data: {
            labels: ["0", "1", "2", "3", "4", "5"],
            datasets: [
              {
                label: "Answers for the question: " + this.questions.content,
                data: [],
                backgroundColor: "#FC7727",
                borderColor: "#47b784",
                borderWidth: 1
              }
            ]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    padding: 25
                  }
                }
              ]
            }
          }
        }
      }
    },
    mounted() {
      this.getAnswers()
    },
    methods: {
      getAnswers: function() {
        Firestore.getAnswers(this.$route.params.surveyId, this.questions._id)
        .then(res => {
          this.answers = res.map(a => a.content);
          const counts = this.parseAnswer(this.answers)
          this.chartData.data.datasets[0].data = counts
          console.log(this.chartData)
          const ctx = document.getElementById(this.idValue);
          new Chart(ctx, this.chartData);
        })
      },
      parseAnswer(answer) {
        const counts = [0, 0, 0, 0, 0, 0]
        for (let i = 0; i < answer.length; i++)
        {
          counts[parseInt(answer[i])] += 1
        }
        return counts
      }
    }
  }
  </script>
  
  <style>
  .barGraph {
    width: 100%;
    height: 500px;
    margin-top: 40px;
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
  .templates {
    margin-top: 130px;
    width: 100%
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