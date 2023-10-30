<template>
    <div>
        <div v-for="(q, i) in questions" class="d-flex justify-content-center">
            <MultiChoice v-if="q.qType == 'multi-choice'" :content="q.content" :index="i" v-on="$listeners"></MultiChoice>
            <MultiSelect v-if="q.qType == 'multi-select'" :content="q.content" :index="i" v-on="$listeners"></MultiSelect>
            <Dropdown v-if="q.qType == 'dropdown'" :content="q.content" :index="i" v-on="$listeners"></Dropdown>
            <TextAnswer v-if="q.qType == 'text-answer'" :content="q.content" :index="i" v-on="$listeners"></TextAnswer>
            <LinearScale v-if="q.qType == 'linear-scale'" :content="q.content" :index="i" v-on="$listeners"></LinearScale>
        </div>
        <div class="add-question-div">
            <b-button class="add-question" v-b-modal.add-question-modal>Add Question</b-button>
            <!-- Add question modal - opens when the above button is clicked -->
            <b-modal id="add-question-modal" centered title="Add Question" size="sm">
                <b-form-group>
                    <b-form-radio v-model="addQuestionSelect" name="add-question" value="multi-choice" class="d-flex">
                        <p class="add-question-option">Multiple Choice</p>
                    </b-form-radio>
                    <b-form-radio v-model="addQuestionSelect" name="add-question" value="multi-select" class="d-flex">
                        <p class="add-question-option">Multiple Select</p>
                    </b-form-radio>
                    <b-form-radio v-model="addQuestionSelect" name="add-question" value="dropdown" class="d-flex">
                        <p class="add-question-option">Dropdown</p>
                    </b-form-radio>
                    <b-form-radio v-model="addQuestionSelect" name="add-question" value="text-answer" class="d-flex">
                        <p class="add-question-option">Text Answer</p>
                    </b-form-radio>
                    <b-form-radio v-model="addQuestionSelect" name="add-question" value="linear-scale" class="d-flex">
                        <p class="add-question-option">Linear Scale</p>
                    </b-form-radio>
                </b-form-group>
                <template #modal-footer>
                    <div class="d-flex justify-contents-end">
                        <!-- <b-button class="cancel-button" v-on:click="() => closeModal()">
                            Close
                        </b-button> -->
                        <b-button class="nav-button" v-on:click="() => addQuestion()">
                            Add
                        </b-button>
                    </div>
                </template>
            </b-modal>
        </div>
    </div>
</template>

<script>
import MultiChoiceEdit from './edit-survey-components/MultiChoice.vue';
import MultiSelectEdit from './edit-survey-components/MultiSelect.vue';
import DropdownEdit from './edit-survey-components/Dropdown.vue';
import TextAnswerEdit from './edit-survey-components/TextAnswer.vue';
import LinearScaleEdit from './edit-survey-components/LinearScale.vue';

export default {
	name: 'EditQuestions',
	components: {
        MultiChoice: MultiChoiceEdit,
        MultiSelect: MultiSelectEdit,
        Dropdown: DropdownEdit,
        TextAnswer: TextAnswerEdit,
        LinearScale: LinearScaleEdit
	},
    props: {
        questions: Array
    }, 
	data() {
		return {
            addQuestionSelect: null
		}
	},
	methods: {
        closeModal() {
			this.$bvModal.hide("add-question-modal")
		},
        addQuestion() {
            var ele = document.getElementsByName('add-question');
          
            for(var i = 0; i < ele.length; i++) {
                if(ele[i].checked) {
                    let content = {"title": ""}
                    switch(ele[i].value) {
                        case "multi-choice":
                            content["options"] = [{"text": "Option", "imgSrc": ""}]
                            break;
                        case "multi-select":
                            content["options"] = ["Option"]
                            break;
                        case "dropdown":
                            content["options"] = ["Option"]
                            break;
                        case "text-answer":
                            content["imgSrc"] = ""
                            break;
                        case "linear-scale":
                            content["start"] = 1
                            content["end"] = 5
                            content["startLabel"] = ""
                            content["endLabel"] = ""
                            break;
                    }
                    this.questions.push({
                        "qType": ele[i].value,
                        "content": content
                    })
                }
            }
            this.$bvModal.hide("add-question-modal")
        }
    }
}
</script>

<style scoped>

.question-container {
    margin: 1rem 0.5rem 0 0.5rem;
	padding: 1.5rem 3rem;
	background-color: white;
	border-radius: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
    width: 80%;
}

.question-text-box {
    border-color: lightgray;
	border-top-style: none;
	border-left-style: none;
	border-right-style: none;
	border-bottom-style: solid;
    border-width: thin;
    padding: 0.5rem;
    width: 60%;
    font-size: large;
}

.question-title-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 80%;
}

.question-number {
    color: #FF7222;
    margin: 0;
    padding-right: 1rem;
    font-weight: bold !important;
}

.question-head-container {
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
}

.question-type-text {
	color: lightgray !important;
	font-style: italic;
}

.option-container {
	display: flex;
	width: 100%;
	margin: 0.5rem !important;
	align-items: center;
}

.option-text-box {
    border-color: lightgray;
	border-top-style: none;
	border-left-style: none;
	border-right-style: none;
	border-bottom-style: solid;
    border-width: thin;
    padding: 0.5rem !important;
    min-width: 15%;
	max-width: 85%;
	margin-left: 1rem;
}

.add-option-div {
	width: 100%;
	margin: 0.5rem !important;
}

.add-option {
	background: transparent !important;
	border: 0 !important;
	color: gray !important;
	margin-left: 2rem;
}

.add-option:hover {
	background: lightgray !important;
	color: white !important;
}

.add-option:focus, .add-option:active {
    color: gray !important;
}

.add-question-div {
    font-size: large;
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}

.add-question {
	background: #FF7222 !important;
	border: 0 !important;
	color: white !important;
	width: 80%;
}

.add-question:hover {
	background: #ff8e4d !important;
}

.add-question:focus, .add-question:active {
    background: #FF7222 !important;
}

.add-question-option {
    margin: 0.2rem 0.2rem 0rem 1rem;
    color: black !important;
}
</style>
