<script setup>
</script>

<template>
    <div id="example" style="display:flex; flex-direction:column; width: 300px; margin: auto">
        <button v-on:click="exportCSV(true)">Export with Demographics</button>
        <button v-on:click="exportCSV(false)">Export</button>
    
        <button v-on:click="getResponsesByQuestion">Get Responses By Question</button>
        <button v-on:click="getSurveyAnalyticsCount">Get Survey Analytics Count</button>
        <button v-on:click="getSurveyAnalyticsText">Get Survey Analytics Text</button>
        <button v-on:click="getSurveyAnalyticsProportion">Get Survey Analytics Proportion</button>
        <button v-on:click="getSurveyAnalyticsMultiCount">Get Survey Analytics Multi Count</button>
        <p style="margin-top: 10px">Backdoor buttons</p>
        <button v-on:click="logAll">Log All</button>
        <button v-on:click="addResponseToFirestore">Add New Response to Firestore</button>
        <button v-on:click="addDataToFirestore">Add Initial Mock Data to Firestore</button>
        <button v-on:click="removeAllResponses">Remove All Responses</button>
        <b-button class="complete-survey-button" v-b-modal="'surveyModal'">Add Custom Response</b-button>
        <b-modal :id="'surveyModal'" title="Preview Survey" size="xl">
            <CompleteSurvey :questions="survey.questions" :response="response"></CompleteSurvey>
            <template #modal-footer>
              <div class="float-right">
                  <b-button class="submit-button" v-on:click="() => submitSurvey()">
                      Submit
                  </b-button>
              </div>
          </template>
        </b-modal>
    </div>
</template>

<script>
import ExportSurveyAnalytics from '../../Firestore/ExportSurveyAnalytics';
import SurveyAnalytics from '../../Firestore/SurveyAnalytics';
import BackdoorData from '../../Firestore/BackdoorData';
import CompleteSurvey from '../game-dashboard/CompleteSurvey.vue'
import {db} from '../../db';
import Response from '../../Firestore/Response.js'

const sID = "KjMwKbjDbAxPwOhKsOEi"

export default {
    name: "FakeSurveyAnalytics",
    components: {
        CompleteSurvey
    },
    props: {},
    data() {
        return {
            survey: {},
            numFakeTesters: 0,
            response: {responses:[]}
        }
    },
    mounted() {
        BackdoorData.getSurveyById(sID).then(x => {
            this.survey = x;
            console.log(this.survey)
        })
    },
    methods: {
        async exportCSV(addAnalytics) {
            try {
                ExportSurveyAnalytics.exportCSVBySurvey(sID, addAnalytics)
                .then((res) => {
                    var csvText = res.data
                    console.log(csvText)
                    var encodedUri = encodeURI(csvText);
                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "my_data.csv");
                    document.body.appendChild(link);
                    link.click()
                })
            } catch (error) {
                console.error('Error fetching responses by question:', error);
            }
        },
        async getResponsesByQuestion() {
            try {
                const response = await SurveyAnalytics.getResponsesByQuestion(sID, 0);
                alert(JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching responses by question:', error);
            }
        },
        async getSurveyAnalyticsCount() {
            try {
                const response = await SurveyAnalytics.getSurveyAnalyticsCount(sID, 0);
                alert(JSON.stringify(response.data));
            } catch (error) {
            console.error('Error fetching survey analytics count:', error);
            }
        },
        async getSurveyAnalyticsText() {
            try {
                const response = await SurveyAnalytics.getSurveyAnalyticsText(sID, 3);
                alert(response.data);
            } catch (error) {
                console.error('Error fetching survey analytics text:', error);
            }
        },
        async getSurveyAnalyticsProportion() {
            try {
                const response = await SurveyAnalytics.getSurveyAnalyticsProportion(sID, 4);
                alert(JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching survey analytics percent:', error);
            }
        },
        async getSurveyAnalyticsMultiCount() {
            try {
                const response = await SurveyAnalytics.getSurveyAnalyticsMultiCount(sID, 1);
                alert(JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching survey analytics multi-count:', error);
            }
        },
        async addResponseToFirestore() {
            try {
                await db.collection("Response").add({
                    sID: sID,
                    status: 1,
                    testerID: "FakeTester",
                    responses: [
                        { "index": 0, "value": 0 },
                        { "index": 1, "value": [1, 2] },
                        { "index": 2, "value": 1 },
                        { "index": 3, "value": "tester 3" },
                        { "index": 4, "value": 5 }
                    ]
                });

                alert('Response added to Firestore successfully.');
            } catch (error) {
                console.error('Error adding response to Firestore:', error);
            }
        },
        async addDataToFirestore() {
            try {
                BackdoorData.addAll()

                alert('Initial mock data added to Firestore successfully.');
            } catch (error) {
                console.error('Error adding data to Firestore:', error);
            }
        },
        async addFakeData() {
            try {
                await db.collection("Users").doc(sID).set({
                    "status": 1,
                    "developerID": "Js3kHsBGUieAZa3PGB3KbBkB4tF2",
                    "testerIDs": [],
                    "questions": [
                        {
                            "content": {
                                "title": "q1MC",
                                "options": [
                                    {
                                        "text": "1Option1",
                                        "imgSrc": ""
                                    },
                                    {
                                        "imgSrc": "",
                                        "text": "1Option2"
                                    },
                                    {
                                        "imgSrc": "",
                                        "text": "1Option3"
                                    },
                                    {
                                        "text": "1Option4",
                                        "imgSrc": ""
                                    },
                                    {
                                        "text": "1Option5",
                                        "imgSrc": ""
                                    }
                                ]
                            },
                            "qType": "multi-choice"
                        },
                        {
                            "content": {
                                "options": [
                                    "2Option1",
                                    "2Option2",
                                    "2Option3",
                                    "2Option4",
                                    "2Option5"
                                ],
                                "title": "q2MS"
                            },
                            "qType": "multi-select"
                        },
                        {
                            "content": {
                                "title": "q3Dropdown",
                                "options": [
                                    "3Option1",
                                    "3Option2",
                                    "3Option3",
                                    "3Option4"
                                ]
                            },
                            "qType": "dropdown"
                        },
                        {
                            "content": {
                                "title": "q4Text",
                                "imgSrc": ""
                            },
                            "qType": "text-answer"
                        },
                        {
                            "content": {
                                "startLabel": "Low",
                                "endLabel": "High",
                                "start": 1,
                                "end": "7",
                                "title": "q5Scale"
                            },
                            "qType": "linear-scale"
                        }
                    ],
                    "gameID": "WJcUsN11pSxGvP5IX3yV",
                    "name": "TestSurvey",
                    "description": "aszdasdf",
                    "tags": [
                        "Mechanics",
                        "Environment"
                    ],
                    "name_lower": "testsurvey"
                });

                alert('Survey added to Firestore successfully.');
            } catch (error) {
                console.error('Error adding users to Firestore:', error);
            }
        },
        async logAll() {
            BackdoorData.logAll();
        },
        async removeAllResponses() {
            try {
                await BackdoorData.removeAllResponses("KjMwKbjDbAxPwOhKsOEi");
                alert("Successfully removed all responses from database.");
            } catch (error) {
                console.error('Error removing all responses from database', error);
            }
        },
        submitSurvey() {
            Response.saveResponses(sID, "FakeTester" + this.numFakeTesters, this.response.responses)
            this.numFakeTesters += 1
            this.$bvModal.hide('surveyModal')
            this.response.responses = []
        }
    },
}
</script>

<style scoped>

button {
    border: 2px solid;
    margin-top: 4px;
    background-color: white;
    color: black;
    border-radius: 4px;
}

</style>