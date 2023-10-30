<template>
<div>
    <div v-for="(q, i) in questions" class="question">
        <MultiChoice v-if="q.qType == 'multi-choice'" :index="i" :content="q.content"></MultiChoice>
        <MultiSelect v-if="q.qType == 'multi-select'" :index="i" :content="q.content"></MultiSelect>
        <Dropdown v-if="q.qType == 'dropdown'" :index="i" :content="q.content"></Dropdown>
        <TextAnswer v-if="q.qType == 'text-answer'" :index="i" :content="q.content"></TextAnswer>
        <LinearScale v-if="q.qType == 'linear-scale'" :index="i" :content="q.content"></LinearScale>
        <hr/>
    </div>
</div>
</template>

<script>
import MultiChoicePreview from './preview-survey-components/MultiChoice.vue';
import MultiSelectPreview from './preview-survey-components/MultiSelect.vue';
import DropdownPreview from './preview-survey-components/Dropdown.vue';
import TextAnswerPreview from './preview-survey-components/TextAnswer.vue';
import LinearScalePreview from './preview-survey-components/LinearScale.vue';

export default {
    name: 'PreviewSurvey',
    components: {
        MultiChoice: MultiChoicePreview,
        MultiSelect: MultiSelectPreview,
        Dropdown: DropdownPreview,
        TextAnswer: TextAnswerPreview,
        LinearScale: LinearScalePreview
    },
    props: {
        questions: Array
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
  