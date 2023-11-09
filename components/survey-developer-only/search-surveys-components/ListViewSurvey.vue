<template>
  <div class="template-container">
    <div v-for="(survey, index) in surveys" class="list card-container">
      <div class="w-100">
        <div class="card-head-container align-items-start">
          <div>
            <div class="d-flex justify-content-between align-items-end">
              <h4 class="survey-title" :title="survey.name">{{ survey.name }}</h4>
            </div>
            <!-- <h6 class="survey-title"><span style="font-style:italic">{{ survey.gameID }}</span></h6> -->
            <div class="d-flex justify-content-between align-items-end">
              <p :title="survey.description" class="list description-container">{{
                survey.description }}</p>
            </div>
          </div>
          <div class="d-flex justify-content-end align-items-center template-buttons">
            <b-button class="template-nav-button" v-b-modal="modalId(index)">View</b-button>
            <!-- View template modal - opens when the above button is clicked -->
            <b-modal :id="'view-template' + index" title="View Template" size="xl" hide-footer>
              <template #modal-title>
                <div class="modal-title">
                  {{ survey.name }}
                </div>
              </template>
              <ViewTemplate :template="survey" :index="index"></ViewTemplate>
            </b-modal>
            <b-button class="template-nav-button" v-b-modal="deleteModalId(index)">Delete</b-button>
            <!-- Publish confirm modal - opens when the above button is clicked -->
            <b-modal :id="'delete-confirm' + index" centered title="Confirm">
              <p class="confirm-modal-text">Are you sure you would like to delete?</p>
              <template #modal-footer>
                <div class="float-right">
                  <b-button class="close-button" v-on:click="() => closeDeleteModal(index)">
                    Close
                  </b-button>
                  <b-button class="delete-button" v-on:click="() => deleteSurvey(survey.sID, index)">
                    Delete
                  </b-button>
                </div>
              </template>
            </b-modal>
          </div>
        </div>
        <div class="w-100">

          <div class="d-flex align-items-end justify-content-between">
            <div :id="'tag-container-' + survey.sID" :title="survey.tags"
              class="d-flex flex-wrap justify-content-start list tag-button-container">
              <label v-for="tag in survey.tags" class="tag-button-child">{{ tag }}</label>
            </div>
            <span v-if="tagsOverflowing[index]" :title="survey.tags" style="font-style:italic; color: #BEBEBE;">...
              And other tags</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ViewTemplate from '../../survey-create/search-templates-components/ViewTemplate.vue';

export default {
  name: 'ListViewTemplate',
  components: {
    ViewTemplate
  },
  props: ['surveys'],
  data() {
    return {
      tagsOverflowing: [],
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
    this.tagsOverflowing = Array(this.surveys.length).fill(false);
    this.resizeHandler();
  },
  unmounted() {
    window.addEventListener('resize', this.resizeHandler);
  },
  methods: {
    modalId(index) {
      return 'view-template' + index;
    },
    deleteModalId(index) {
      return 'delete-confirm' + index;
    },
    closeConfirmModal(index) {
      this.$bvModal.hide('view-template' + index)
    },
    closeDeleteModal(index) {
			this.$bvModal.hide("delete-confirm" + index)
		},
    deleteSurvey(surveyId, index) {
      let survey = this.surveys.find(survey => {
        return survey.sID === surveyId
      })
      this.$emit('delete-survey', survey)
      this.closeDeleteModal(index)
    },
    resizeHandler() {
      this.surveys.forEach((value, i) => {
        let element = document.getElementById('tag-container-' + value.sID)
        if (this.checkOverflow(element)) {
          Vue.set(this.tagsOverflowing, i, true);
        } else {
          Vue.set(this.tagsOverflowing, i, false);
        }
      });
    },
    checkOverflow(el) {
      let curOverflow = el.style.overflow;

      if (!curOverflow || curOverflow === "visible")
        el.style.overflow = "clip";

      let isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
      el.style.overflow = curOverflow;
      return isOverflowing;
    },
  }
}
</script>

<style scoped>
div.template-container {
  justify-content: stretch;
  gap: 1rem 0px !important;
}

.list.card-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: none;
  height: auto;
  margin: 0px;
  padding: 1rem 2rem;
  background-color: white;
  border-radius: 30px;
}

.list.description-container {
  display: -webkit-box;
  overflow: hidden;
  max-height: 1.5rem;
  color: lightgray !important;
  font-style: italic !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.list.tag-button-container {
  overflow-y: clip;
  width: 80%;
  max-height: 40px;
}

.modal-title {
  color: #FF7222 !important;
  font-weight: bold;
}
</style>
