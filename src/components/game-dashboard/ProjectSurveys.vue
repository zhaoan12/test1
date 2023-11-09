<template>
    <div class="d-flex">
        <navigator :flag="navFlag" />
        <div class="surveys-page">
            <div class="title-header">
                <h1> {{ projectName }} </h1>
            </div>
            <div class="p-3">
                <div class="surveys-search-bar">
                    <b-form-input v-model="searchTerm" placeholder="Search by name" class="text-input"></b-form-input>
                </div>
                <div class="survey-cards-container">
                    <div v-for="(survey, i) in filteredSurveys" class="survey-card">
                        <div class="survey-info">
                            <div class="survey-name">{{ survey.name }}</div>
                            <div class="survey-description">{{ survey.description }}</div>
                        </div>
                        <!-- <b-button class="instructions-button">Instructions</b-button> -->
                        <b-button class="complete-survey-button" v-b-modal="modalId(i)">Complete Survey</b-button>
                        <!-- Preview survey modal - opens when the above button is clicked -->
                        <b-modal :id="'preview-modal-' + i" title="Preview Survey" size="xl">
                            <CompleteSurvey :questions="survey.questions" :response="response"></CompleteSurvey>
                            <template #modal-footer>
                            <div class="float-right">
                                <b-button class="submit-button" v-on:click="() => submitSurvey(survey, i)">
                                    Submit
                                </b-button>
                            </div>
                        </template>
                        </b-modal>
                    </div>
                    <div v-if="filteredSurveys.length == 0" class="no-surveys">
                        <img src="../../assets/Not Found.png" class="w-10">
                        <div>No surveys found</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CompleteSurvey from './CompleteSurvey.vue'
import navigator from '../layout/NavBarNew.vue'
import Template from '../../Firestore/Template.js'
import Response from '../../Firestore/Response.js'

export default {
    name: "ProjectSurveys",
    components: {
        navigator,
        CompleteSurvey
    },
    data() {
        return {
            userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1, // 0: Tester, 1: dev, 2: Admin
            searchTerm: "",
            navFlag: 0,
            // get from db after
            surveys: [],
            projectName: "",
            response: { 'responses': [] }
        }
    },
    computed: {
        filteredSurveys() {
            return this.surveys.filter(survey => 
                survey.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            )
        }
    },
    mounted() {
        // redirect to login if the user is not logged in
        if (window.localStorage.getItem("userType")) {
            this.userType = parseInt(window.localStorage.getItem("userType"));
        } else {
            this.$router.push({
                name: 'login',
            })
        }
        this.projectName = window.localStorage.getItem('gameName')
        Template.getSurveysByGameID(window.localStorage.getItem('gameId')).then(res => {
            this.surveys = res.data.filter(survey => survey.status == 1)
        })
    },
    methods: {
        modalId(i) {
            return 'preview-modal-' + i
        },
        submitSurvey(survey, index) {
            Response.saveResponses(survey.sID, window.localStorage.getItem('userId'), this.response.responses)
            this.surveys.splice(index, 1)
            this.$bvModal.hide('preview-modal-' + index)
        }
    }
}
</script>

<style scoped>
.surveys-page {
	display: flex;
	flex-direction: column;
	justify-content: stretch;
	width: 100%;
	height: 100vh;
  	max-height: 100vh;
	background-color: #EEEEEE;
}

.title-header {
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 75px;
    box-shadow: 0 4px 10px -6px grey;
}

.title-header h1 {
	color: #FF7222;
	font-weight: bold;
}

.surveys-search-bar {
    margin: 0.5rem;
}

.text-input.form-control {
  background-color: white !important;
  border-radius: 10px !important;
  color: #8e8e8e !important;
  border: none;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.survey-cards-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.survey-card {
    background-color: white;
    border-radius: 10px;
    margin: 0.5rem;
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

@media only screen and (max-width: 1200px) and (min-width: 700px) {
    .survey-card { 
        width: calc(50% - 1rem) !important; /* fit 2 cards on screen */
    }
}

@media only screen and (min-width: 1200px) {
    .survey-card {
        width: calc(33.3333333333% - 1rem) !important; /* fit 3 cards on screen */
    }
}

.survey-name {
    color: #FF7222 !important;
    font-weight: bold;
    font-size: large;
}

.survey-description {
    color: lightgray !important;
	font-style: italic;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.survey-info {
    display: flex;
    flex-direction: column;
}

.complete-survey-button, .submit-button{
	background: #FF7222 !important;
	border: 0 !important;
	height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem 0;
}

.complete-survey-button:hover, .submit-button:hover {
	background: #ff8e4d !important;
}

.complete-survey-button:active, .complete-survey-button:focus, .submit-button:active, .submit-button:focus {
	background: #FF7222 !important;
}

.no-surveys {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-top: 10%;
}
</style>

<style scoped>
button {
	border: 0 !important;
	background-color: transparent !important;
}
</style>