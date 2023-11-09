<template>
  <div class="game-detail-analysis">
    <div>
      <transition name="fade">
        <Loading v-if="isLoading"></Loading>
      </transition>
    </div>
    <template v-if="resultVisible">
      <div class="game-detail-description">
        <div class="viewresults-back" @click="toDetailAnalysis">
          ← Go Back
        </div>
        <div class="gamedetail-title white-text" id="surveytitle">
          SURVEY RESULTS FOR HUMAN SIMULATOR
        </div>

        <div class="gamedetail-content white-text">
          The results for the survey on Human Simulator 2023.
        </div>
        <div class="gamedetail-title white-text" id="surveytitle">
          QUESTION 1: What are your first impressions of the game?
        </div>

        <Accordion />

        <div class="gamedetail-title white-text" id="surveytitle">
          QUESTION 2: What do you suggest we do to improve the gameplay?
        </div>

        <Accordion />

        <div class="gamedetail-title white-text" id="surveytitle">
          QUESTION 3: Did you come across any major game-breaking bugs? If so,
          please describe them.
        </div>

        <Accordion />

        <div class="gamedetail-title white-text" id="surveytitle">
          QUESTION 4: Do you think you're a better game developer than me?
        </div>

        <Accordion />

        <!--        <div class="gamedetail-title white-text" id="surveytitle">
          QUESTION 1: What are your first impressions of the game?
          <VueBarGraph
            :points=[1,4,5,3,4]
            :show-y-axis="false"
            :show-x-axis="true"
            :width="800"
            :height="400"
            :show-values="true"
            :use-custom-labels="true"
            :custom-labels="['I hated it', 'Your mom', 'This game was a masterpiece!', 'Abr', 'Mai']"
          />
        </div>-->

        <div class="gamedetail-title white-text" id="surveytitle">
          QUESTION 6: How many hours have you played this game for?
        </div>

        <bar-chart :chartData="barChartData" />
      </div>
    </template>
    <template v-if="mainVisible">
      <div class="gda-survey-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-clipboard-data gda-icon"
          viewBox="0 0 16 16"
        >
          <path
            d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z"
          />
          <path
            d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
          />
          <path
            d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
          />
        </svg>
        <h3 class="gda-text">Surveys</h3>
        <button class="survey-btn-add" v-on:click="newSurvey()">
          Add New Survey
        </button>
        <div class="gda-survey-list">
          <div v-for="item in surveyObj" class="gda-survey">
            <div class="gda-text-container">
              <div class="survey-title">{{ item.name }}</div>
              <!--p v-if="item.status == 1">{{ item.responses }}Completed</p-->
              <!-- <div class="new-text" v-if="item.status == 0">New</div> -->
            </div>
            <button
              class="survey-btn"
              v-if="item.status != 0"
              v-on:click="viewResults(item)"
            >
              Results
            </button>
            <button
              class="survey-btn"
              v-if="item.status == 0"
              v-on:click="publishSurvey(item)"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
      <div class="gda-interviews-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-pencil-square gda-icon"
          viewBox="0 0 16 16"
        >
          <path
            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
          />
          <path
            fill-rule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
          />
        </svg>
        <h3 class="gda-text">Interviews</h3>
      </div>
      <div class="gda-in-game-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-display gda-icon"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z"
          />
        </svg>
        <h3 class="gda-text">In Game</h3>
      </div>

      <!--b-modal id="bv-modal" hide-footer>
          <template #modal-title>
              <h1>Notes</h1>
          </template>
          <div class="d-block text-center">
              <div id="noteContainer" v-for="note in this.visibleNotes">
                  <p id="noteTimestamp">
                    {{new Intl.DateTimeFormat('default', {dateStyle: 'short', timeStyle: 'short'}).format(note.timestamp.toDate())}}
                  </p>
                  <p id="noteText">
                    {{note.text}}
                  </p>
              </div>
          </div>
          <div class="close-button" block @click="closeNotesModal">Close</div>
      </b-modal>
      <p class="white-text">Analysis</p>
      <testSessionItem
                v-for="session in sessions"
                :key="session.id"
                :id="session.id"
                :focus="session.focus"
                :testerName="session.testerName"
                :developerName="session.developerName"
                :startDateTime="session.startDateTime"
                :endDateTime="session.endDateTime"
                :notes="session.notes"
                @openNotesModal="openNotesModal" /-->
    </template>
  </div>
</template>

<script>
import Template from "../../Firestore/Template.js";
import Response from "../../Firestore/Response.js";
import GameTesting from "../../Firestore/GameTesting.js";
import testSessionItem from "./TestSessionItem.vue";
import Loading from "../loading/index.vue";
import Accordion from "../survey-reporting/TextAccordion.vue";
import VueBarGraph from "vue-bar-graph";
import BarChart from "../survey-reporting/BarChart.vue";

import { ref } from "vue";

export default {
  name: "gameDetailAnalysis",
  components: {
    testSessionItem,
    Loading,
    Accordion,
    VueBarGraph,
    BarChart
  },
  props: {
    detail: {
      type: Object
    }
  },
  data() {
    return {
      surveyObj: [],
      mainVisible: true,
      isLoading: false,
      resultVisible: false,
      barChartData: [12, 19, 3, 5, 2, 3],
      userType: window.localStorage.getItem("userType")
        ? parseInt(window.localStorage.getItem("userType"))
        : -1 // 0: Tester, 1: Company, 2: Admin
      //sessions: [],
      //visibleNotes: null,
    };
  },
  methods: {
    newSurvey() {
      this.$router.push({ name: "createSurvey" });
    },
    increment(num, max) {
      if (num < max) {
        return num + 1;
      }
    },
    showLoading() {
      this.isLoading = true;
      setTimeout(() => (this.isLoading = false), 200);
    },
    // Go back to main Analysis menu
    toDetailAnalysis() {
      this.showLoading();
      this.mainVisible = true;
      this.resultVisible = false;
    },
    publishSurvey(survey) {
      Response.assignSurveyToAll(survey.sID, survey.testerIDs)
        .then(() => {
          survey.status = 1;
        })
        .catch(e => console.log(e));
    },
    viewResults(survey) {
      this.mainVisible = false;
      this.resultVisible = true;
      this.showLoading();
    } // not yet implemented
  },
  mounted() {
    Template.getSurveysByGameID(window.localStorage.getItem("gameId"))
      .then(res => {
        this.surveyObj = res.data;
      })
      .catch(e => console.log(e));
  }
  /*
  mounted() {
      if (window.localStorage.getItem("userType")) {
        this.userType = parseInt(window.localStorage.getItem("userType"));
        this.$nextTick(() => {
          this.getSessionData();
        });
      } else {
          this.$router.push({
              name: 'login',
          })
      }
  },
  methods: {
    getSessionData() {
      GameTesting.getGameTestSessions(this.detail.gameId)
        .then(res => {
          if (res.success) {
              this.sessions = res.data;
          }
        })
        .catch(e => console.log(e));
    },
    openNotesModal(sessionID) {
      this.visibleNotes = this.sessions.filter(s => s.id===sessionID)[0].notes;
      this.$bvModal.show('bv-modal');
    },
    closeNotesModal() {
      this.visibleNotes = null;
      this.$bvModal.hide('bv-modal');
    },
  }, */
};
// export default {
//   name: "gameDetailAnalysis",
//   components: {
//     testSessionItem
//   },
//   props: {
//     detail: {
//       type: Object
//     }
//   },
//   data() {
//     return {
//       surveyObj: [],
//       userType: window.localStorage.getItem("userType")
//         ? parseInt(window.localStorage.getItem("userType"))
//         : -1 // 0: Tester, 1: Company, 2: Admin
//       //sessions: [],
//       //visibleNotes: null,
//     };
//   },
//   methods: {
//     newSurvey() {
//       this.$router.push({ name: "createSurvey" });
//     },
//     publishSurvey(survey) {
//       Response.assignSurveyToAll(survey.sID, survey.testerIDs)
//         .then(() => {
//           survey.status = 1;
//         })
//         .catch(e => console.log(e));
//     },
//     viewResults() {} // not yet implemented
//   },
//   mounted() {
//     Template.getSurveysByGameID(window.localStorage.getItem("gameId"))
//       .then(res => {
//         this.surveyObj = res.data;
//       })
//       .catch(e => console.log(e));
//   }
//   /*
//       mounted() {
//           if (window.localStorage.getItem("userType")) {
//             this.userType = parseInt(window.localStorage.getItem("userType"));
//             this.$nextTick(() => {
//               this.getSessionData();
//             });
//           } else {
//               this.$router.push({
//                   name: 'login',
//               })
//           }
//       },
//       methods: {
//         getSessionData() {
//           GameTesting.getGameTestSessions(this.detail.gameId)
//             .then(res => {
//               if (res.success) {
//                   this.sessions = res.data;
//               }
//             })
//             .catch(e => console.log(e));
//         },  
//         openNotesModal(sessionID) {
//           this.visibleNotes = this.sessions.filter(s => s.id===sessionID)[0].notes;
//           this.$bvModal.show('bv-modal');
//         },
//         closeNotesModal() {
//           this.visibleNotes = null;
//           this.$bvModal.hide('bv-modal');
//         },
//       }, */
// };
</script>

<style scoped>
.game-detail-analysis {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
}

.gda-survey-box,
.gda-interviews-box,
.gda-in-game-box {
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  width: 30%;
  margin: 0 2%;
  align-items: center;
}

@media only screen and (max-width: 1330px) {
  .gda-survey-box,
  .gda-interviews-box,
  .gda-in-game-box {
    width: 360px;
  }
}

.gda-icon {
  height: 15%;
  color: #aaa;
  margin: 5%;
}

.gda-text {
  color: #fc7727;
}

.survey-btn,
.survey-btn-add {
  background-color: #fc7727 !important;
  color: #fff;
  border: none;
  border-radius: 10px !important;
  padding: 0.25rem 0.5rem;
}

.survey-btn-add {
  width: 75%;
  margin-bottom: 3%;
  padding: 1%;
}

.survey-btn {
  height: fit-content;
}

.survey-btn:hover,
.survey-btn-add:hover {
  background-color: #ff8e4d !important;
}

.gda-survey-list {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  width: 100%;
  align-items: center;
  overflow: auto;
}

.gda-survey {
  width: 90%;
  display: flex;
  flex-direction: row;
  background-color: transparent !important;
  border: 1px solid #ccc !important;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 15px !important;
  justify-content: space-between;
  align-items: center;
}

.gda-text-container {
  display: flex;
  flex-direction: column;
  width: 60%;
}
.survey-title {
  color: #000 !important;
  font-size: large;
}

.new-text {
  font-style: italic;
  color: #bebebe;
}

.viewresults-back {
  height: 21px;
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 21px;
  text-decoration-line: underline;
  color: #000000;
  margin-bottom: 34px;
  cursor: pointer;
}

#gamedetail-modify {
  position: absolute;
  width: 25%;
  height: 40px;
  right: 0;
  top: 50px;
  background: #fc7727;
  color: var(--GAMEDM);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
}

.gamedetail-title {
  margin-top: 40px;
  margin-bottom: 20px;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 13px;
  display: flex;
  align-items: center;
}

.gamedetail-content {
  margin-bottom: 5px;
  font-style: normal;
}

.white-text {
  color: #000000;
}

.game-detail-description {
  position: relative;
  margin-right: 5%;
}

/* previous team styles (keeping it since I kept the previous team's html commented out)
#noteContainer {
  margin: 1px;
  padding: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  border-bottom: 1px solid black;
}
#noteContainer:last-child {
  margin: 1px;
  padding: 3px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  border: none;
}
#noteTimestamp {
  width: 30%;
}
#noteText {
  width: 70%;
}
.close-button {
    width: 93.08px;
    height: 28px;
    background: #666464;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 5px;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;
    text-align: center;
    color: #C4C2C2;
    cursor: pointer;
} */
</style>
