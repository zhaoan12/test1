<template>
    <div>
        <div v-for="(q, i) in questions" class="question">
            <MultiChoice v-if="q.qType == 'multi-choice'" :index="i" :content="q.content" @choose-multi-choice="chooseAnswer"></MultiChoice>
            <MultiSelect v-if="q.qType == 'multi-select'" :index="i" :content="q.content" @choose-multi-select="chooseMultiSelect"></MultiSelect>
            <Dropdown v-if="q.qType == 'dropdown'" :index="i" :content="q.content" @choose-dropdown="chooseAnswer"></Dropdown>
            <TextAnswer v-if="q.qType == 'text-answer'" :index="i" :content="q.content" @choose-text-answer="chooseAnswer"></TextAnswer>
            <LinearScale v-if="q.qType == 'linear-scale'" :index="i" :content="q.content" @choose-linear-scale="chooseAnswer"></LinearScale>
            <hr/>
        </div>
    </div>
</template>
    
<script>
import MultiChoice from '../survey-create/preview-survey-components/MultiChoice.vue';
import MultiSelect from '../survey-create/preview-survey-components/MultiSelect.vue';
import Dropdown from '../survey-create/preview-survey-components/Dropdown.vue';
import LinearScale from '../survey-create/preview-survey-components/LinearScale.vue';
import TextAnswer from '../survey-create/preview-survey-components/TextAnswer.vue';

export default {
    name: 'CompleteSurvey',
    components: {
        MultiChoice,
        MultiSelect,
        Dropdown,
        TextAnswer,
        LinearScale
    },
    props: {
        questions: Array,
        response: Object
    },
    methods: {
        // multi-choice, dropdown, linear-scale, or text-answer question is answered
        chooseAnswer(questionIdx, answer) {
            let question = this.response.responses.find(q => q.index == questionIdx)
            if (!question) { // question has not been answered yet
                this.response.responses.push({'index': questionIdx, 'value': answer})
            } else {
                question.value = answer
            }
        },
        // multi-select question is answered
        chooseMultiSelect(questionIdx, answer) {
            let question = this.response.responses.find(q => q.index == questionIdx)
            if (!question) { // if the question has not been answered yet
                this.response.responses.push({'index': questionIdx, 'value': [answer]})
            } else {
                if (question.value.includes(answer)) {
                    // deselecting
                    question.value.splice(question.value.indexOf(answer), 1)
                } else {
                    // selecting
                    question.value.push(answer)
                }
            }
        }
    }
}
</script>

<style scoped>
hr {
    width: 100% !important;
}

.question:last-child hr {
    display: none;
}
</style>
      