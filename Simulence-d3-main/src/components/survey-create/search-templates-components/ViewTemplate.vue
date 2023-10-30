<template>
    <div class="pb-3">
        <div class="description">
            {{ template.description }}
        </div>
        <h5 class="subheader">Tags</h5>
        <div class="tags">
            <label v-for="tag in template.tags" class="tag">{{ tag }}</label>
        </div>
        <h5 class="subheader">Questions</h5>
        <div class="questions">
            <div v-for="(q, i) in template.questions" class="question">
                <b-button v-b-toggle="'view-question' + i" class="questions-toggle" v-on:click="clickToggle(i)">
                    <!-- carat down icon -->
                    <svg v-if="!questionsToggle[i]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill caret-icon" viewBox="0 0 16 16">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                    <!-- carat up icon -->
                    <svg v-if="questionsToggle[i]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill caret-icon" viewBox="0 0 16 16">
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                    </svg>
                    <div class="mx-2">
                        Q{{ i+1 }}. {{ q.content.title }}
                    </div>
                </b-button>
                <b-collapse :id="'view-question' + i" class="questions-content">
                    <div>
                        <MultiChoice v-if="q.qType == 'multi-choice'" :index="i" :content="q.content"></MultiChoice>
                        <MultiSelect v-if="q.qType == 'multi-select'" :index="i" :content="q.content"></MultiSelect>
                        <Dropdown v-if="q.qType == 'dropdown'" :index="i" :content="q.content"></Dropdown>
                        <TextAnswer v-if="q.qType == 'text-answer'" :index="i" :content="q.content"></TextAnswer>
                        <LinearScale v-if="q.qType == 'linear-scale'" :index="i" :content="q.content"></LinearScale>
                    </div>
                </b-collapse>
                <hr>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import ViewMultiChoice from './ViewMultiChoice.vue'
import ViewMultiSelect from './ViewMultiSelect.vue'
import ViewDropdown from './ViewDropdown.vue'
import ViewLinearScale from './ViewLinearScale.vue'
import ViewTextAnswer from './ViewTextAnswer.vue'

export default {
    name: 'ViewTemplate',
    components: {
        MultiChoice: ViewMultiChoice,
        MultiSelect: ViewMultiSelect,
        Dropdown: ViewDropdown,
        TextAnswer: ViewTextAnswer,
        LinearScale: ViewLinearScale
    },
    props: {
        template: Object,
        index: Number
    },
    data() {
        return {
            questionsToggle: [] // true for open, false for closed
        }
    },
    monuted() {
        template.questions.forEach(q => {
            this.questionsToggle.push(false)
        })
    },
    methods: {
        clickToggle(index) {
            Vue.set(this.questionsToggle, index, !this.questionsToggle[index])
        }
    }
}
</script>

<style scoped>
.description {
    font-style: italic;
    color: #848d94;
}

.subheader {
    font-weight: normal;
    color: #ff8e4d;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
}

.tags {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}

.tag {
  background-color: #DB3360 !important;
  color: white;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.25rem;
  padding: 0.5rem;
  border-radius: 15px;
}

.questions-toggle {
    color: black;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
}

.questions-content {
    width: 100%;
    margin: 0 2rem;
}

.caret-icon {
    min-width: 16px;
    min-height: 16px;
}

.question:last-child hr {
	display: none;
}

hr {
    margin: 0.5rem 0;
}
</style>