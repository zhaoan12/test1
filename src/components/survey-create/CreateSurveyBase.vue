<template>
	<div class="d-flex">
		<navigator />
		<div class="create-survey">
			<div class="title-header">
				<h1 v-if="userType == 1"> Create Survey </h1>
				<h1 v-if="userType == 2"> Create Template </h1>
			</div>
			<ProgressBar @nodeClick="changeStep" v-if="userType == 1" :progressSteps="devSteps" :step="step"></ProgressBar>
			<ProgressBar @nodeClick="changeStep" v-if="userType == 2" :progressSteps="adminSteps" :step="step"></ProgressBar>
			<div class="survey-container">
				<div>
					<transition name="fade">
						<Loading v-if="isLoading"></Loading>
					</transition>
				</div>
				<div v-if="userType == 1 && step == 1">
					<SelectSurveyStart @create-new="clickNew" @use-template="clickTemplate"></SelectSurveyStart>
				</div>
				<div v-if="userType == 1 && step == 1.5">
					<SearchTemplates :questions="template.questions" @select-template="clickSelect"></SearchTemplates>
				</div>
				<div v-if="userType == 1 && step == 2">
					<SurveyMetaData :template="template" :adminOrDev="userType"></SurveyMetaData>
				</div>
				<div v-if="userType == 1 && (step == 3 || step == 3.5)">
					<EditQuestions :questions="template.questions" @remove-question="removeQuestion"></EditQuestions>
				</div>
				<div v-if="userType == 2 && step == 1">
					<SurveyMetaData :template="template" :adminOrDev="userType"></SurveyMetaData>
				</div>
				<div v-if="userType == 2 && (step == 2 || step ==2.5)">
					<EditQuestions :questions="template.questions" @remove-question="removeQuestion"></EditQuestions>
				</div>
			</div>
			<div v-if="!(userType == 1 && step == 1)" class="survey-nav">
				<div class="survey-nav-button">
					<b-button v-if="step > 1" v-on:click="() => clickPrevious()" class="nav-button">Previous</b-button>
				</div>
				<div class="survey-nav-button">
					<b-button v-if="(userType == 2) || (userType == 1 && step >= 2)" class="nav-button" v-b-modal.preview-survey>
						Preview
					</b-button>
					<!-- Preview survey modal - opens when the above button is clicked -->
					<b-modal id="preview-survey" title="Preview Survey" size="xl" hide-footer>
						<PreviewSurvey :questions="template.questions"></PreviewSurvey>
					</b-modal>
					<b-button v-if="userType == 2 && (step == 2 || step ==2.5)" class="nav-button" v-b-modal.publish-confirm>
						Publish
					</b-button>
					<b-button v-if="userType == 1 && (step == 3 || step == 3.5)" class="nav-button" v-b-modal.publish-confirm>
						Add to Project
					</b-button>
					<!-- Publish confirm modal - opens when the above button is clicked -->
					<b-modal id="publish-confirm" centered title="Confirm">
						<p class="confirm-modal-text" v-if="userType == 1">Are you sure you would like to add this survey to the project?</p>
						<p class="confirm-modal-text" v-if="userType == 2">Are you sure you would like to add this publish this template?</p>
						<template #modal-footer>
							<div class="float-right">
								<b-button class="close-button" v-on:click="() => closeConfirmModal()">
									Close
								</b-button>
								<b-button class="publish-button" v-if="userType == 1" v-on:click="() => createSurvey()">
									Add to Project
								</b-button>
								<b-button class="publish-button" v-if="userType == 2" v-on:click="() => createSurvey()">
									Publish
								</b-button>
							</div>
						</template>
					</b-modal>
					<b-button v-if="(userType == 2 && step == 1) || (userType == 1 && step == 2)" v-on:click="() => clickNext()" class="nav-button">
						Next
					</b-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SelectSurveyStart from './SelectSurveyStart.vue';
import EditQuestions from './EditQuestions.vue';
import PreviewSurvey from './PreviewSurvey.vue';
import navigator from '../layout/NavBarNew.vue';
import Loading from "../loading/index.vue"
import SurveyMetaData from './SurveyMetaData.vue';
import SearchTemplates from './SearchTemplates.vue'
import ProgressBar from './ProgressBar.vue';
import Template from "../../Firestore/Template.js";
import Surveys from "../../Firestore/Surveys.js";
import GamesObject from "../../Firestore/GamesObject.js";


export default {
	name: 'CreateSurvey',
	components: {
		SelectSurveyStart,
		EditQuestions,
		PreviewSurvey,
		navigator,
		Loading,
		SurveyMetaData,
    	SearchTemplates,
		ProgressBar
	},
	data() {
		return {
			userId: window.localStorage.getItem('userId'),
			isLoading: false,
      		userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Developer, 2: Admin
			step: 1,
			template: {
				"name": "",
				"tags": [],
                "description": "",
				"questions": []
			},
			devSteps: ["Select Template", "Survey Details", "Add Questions", "Add to Project"],
			adminSteps: ["Survey Details", "Add Questions",  "Publish"],
			project: {}
		}
	},
	mounted() {
		if (!window.localStorage.getItem("userType") || !window.localStorage.getItem("userId")) {
			this.$router.push({
				name: 'login',
			})
		}
		this.showLoadingScreen()
		GamesObject.getProject(window.localStorage.getItem("gameId"))
		.then(res => {
			this.project = res.data
		})
	},
	methods: {
		showLoadingScreen() {
			this.isLoading = true
			setTimeout(() => this.isLoading = false, 200)
		},
		clickNew() {
			this.step = 2
			this.resetTemplate()
		},
		clickTemplate() {
			this.step = 1.5
			this.resetTemplate()
		},
		// reset to a blank template
		resetTemplate() {
			this.template = {
				"name": "",
				"description": "",
				"tags": [],
				"questions": []
			}
		},
		clickSelect(template) {
			this.template = template
			this.step = 2
		},
		clickPrevious() {
			if (this.step == 1.5) {
        		this.step = 1
      		} else {
        		this.step = Math.floor(this.step - 1)
      		}
			const el = document.getElementsByClassName("survey-container")[0]
			el.scrollTop = 0

    },
    clickNext() {
      this.step += 1
      const el = document.getElementsByClassName("survey-container")[0]
      el.scrollTop = 0

		},
		closeConfirmModal() {
			this.$bvModal.hide("publish-confirm")
		},
		removeQuestion(index) {
			this.template.questions.splice(index, 1)
		},
		changeStep(n, length){
			// console.log('change step ' + n)
			if(n<length){
				this.step = n;
			}
			else{
				this.step = n-0.5;
				this.$bvModal.show("publish-confirm")
			}
		},
        createSurvey() {
			// dev creates survey
			if (this.userType == 1) {
				Template.createSurvey(
					this.template.name,
					JSON.parse(JSON.stringify(this.template.tags)),
					JSON.parse(JSON.stringify(this.template.questions)),
					this.template.description,
					window.localStorage.getItem("gameId"),
          			this.project.testerIds,
          			window.localStorage.getItem('userId')
				)
			}
			// admin creates template
			else if (this.userType == 2) {
				Template.createTemplate(
					this.template.name,
					JSON.parse(JSON.stringify(this.template.tags)),
					JSON.parse(JSON.stringify(this.template.questions)),
					this.template.description
				)
			}
			if (this.userType == 2) {
				this.$router.push({
					name: 'templates',
				})
			} else if (this.userType == 1) {
				window.localStorage.setItem("gameDetailIndex", 1) // gamedetails/analysis
				this.$router.push({
					name: 'gamedetail',
				})
			}
        }
	}
}
</script>

<style scoped>
.create-survey {
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
	height: 75px;
	width: 100%;
}

.title-header h1 {
  color: #FF7222;
  font-weight: bold;
}

h4 {
  color: #FF7222;
  font-weight: bold;
  margin: 1rem 0px;
}

.survey-container {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
}

.survey-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 0.5rem;
  box-shadow: 0px -4px 10px -6px grey;
  width: 100%;
}

.survey-nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button {
  background: #FF7222 !important;
  margin: 5px;
  border: 0 !important;
  width: 8rem;
  height: 2.5rem;
}

button.nav-button:hover {
  background: #ff8e4d !important;
}

.nav-button:active,
.nav-button:focus {
  background: #FF7222 !important;
}

.publish-button {
  background: #FF7222 !important;
  margin: 5px;
  border: 0 !important;
  position: relative;
}

.publish-button:hover {
  background: #ff8e4d !important;
}

.publish-button:focus,
.publish-button:active {
  background: #FF7222 !important;
}

.close-button {
  background: #6c757d !important;
  margin: 5px;
  border: 0 !important;
  position: relative;
}

.close-button:hover {
  background: #848d94 !important;
}

.close-button:focus,
.close-button:active {
  background: #6c757d !important;
}

.placeholder-container {
  margin: 1rem;
  background-color: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  border: 0 !important;
  background-color: transparent !important;
}

.confirm-modal-text {
  color: black !important;
  margin: 0.5rem;
}
</style>
