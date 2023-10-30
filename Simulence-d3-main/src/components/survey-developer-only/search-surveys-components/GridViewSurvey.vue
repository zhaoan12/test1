<template>
  <div class="template-container">
    <div v-for="(survey, index) in surveys" class="grid card-container">
      <div class="w-100">
        <div class="card-head-container align-items-start">
          <h4 class="survey-title" :title="survey.name">{{ survey.name }}</h4>
        </div>
        <div class="card-head-container align-items-start">
          <!-- <h6 class="survey-title"><span style="font-style:italic">{{ survey.gameID }}</span></h6> -->
        </div>
        <div class="w-100">
          <div class="d-flex justify-content-between align-items-end">
            <p :title="survey.description" class="grid description-container">{{
              survey.description }}</p>
          </div>
          <div class="d-flex align-items-end justify-content-between">
            <div :id="'tag-container-' + survey.sID" :title="survey.tags"
              class="d-flex flex-wrap justify-content-start grid tag-button-container">
              <label v-for="tag in survey.tags" class="tag-button-child">{{ tag }}</label>
            </div>
          </div>
          <span v-if="tagsOverflowing[index]" :title="survey.tags" style="font-style:italic; color: #BEBEBE;">...
            And other tags</span>
        </div>
      </div>
      <div class="w-100 d-flex justify-content-end align-items-center">
        <div class="d-flex justify-content-end">
          <b-button class="template-nav-button" v-b-modal="modalId(index)">View</b-button>
          <!-- View template modal - opens when the above button is clicked -->
          <b-modal :id="'view-template' + index" title="View Template" size="xl" hide-footer>
            <div class="modal-title">
              {{ survey.name }}
            </div>
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
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ViewTemplate from '../../survey-create/search-templates-components/ViewTemplate.vue';

export default {
  name: 'GridViewTemplate',
  components: {
    ViewTemplate
  },
  props: ['surveys',],
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
  justify-content: start !important;
  gap: 1.5rem 3.5% !important;
}

.grid.card-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: none;
  height: 328px;
  margin: 0px;
  padding: 1rem 2rem;
  background-color: white;
  border-radius: 30px;
}

.grid.description-container {
  display: -webkit-box;
  overflow: hidden;
  max-height: 4.2rem;
  color: lightgray !important;
  font-style: italic !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.grid.tag-button-container {
  overflow-y: clip;
  width: 100%;
  max-height: 120px;
}

.modal-title {
  color: #FF7222;
  font-weight: bold;
}

@media screen and (max-width:1370px) {
  div.template-container {
    min-width: 450px !important;
    column-gap: 6% !important;
  }

  .grid.card-container {
    width: 47% !important;
  }
}

@media screen and (min-width:1370px) {
  div.template-container {
    column-gap: 3.5% !important;
  }

  .grid.card-container {
    width: 31% !important;
  }
}

@media screen and (min-width:1900px) {
  div.template-container {
    column-gap: 2% !important;
  }

  .grid.card-container {
    width: 23.5% !important;
  }
}

@media screen and (min-width:2300px) {
  div.template-container {
    column-gap: 1.25% !important;
  }

  .grid.card-container {
    width: 19% !important;
  }
}
</style>
