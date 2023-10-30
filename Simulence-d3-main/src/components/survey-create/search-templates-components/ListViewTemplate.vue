<template>
  <div class="template-container">
    <div v-for="(template, index) in templates" class="list card-container">
      <div class="w-100">
        <div class="card-head-container align-items-start">
          <div>
            <div class="d-flex justify-content-between align-items-end">
              <h4 class="template-title" :title="template.name">{{ template.name }}</h4>
            </div>
            <div class="d-flex justify-content-between align-items-end">
              <p :title="template.description" class="list description-container">{{
                template.description }}</p>
            </div>
          </div>
          <div class="d-flex justify-content-end align-items-center template-buttons">
            <b-button class="template-nav-button" v-b-modal="modalId(index)">View</b-button>
            <!-- View template modal - opens when the above button is clicked -->
            <b-modal :id="'view-template' + index" title="View Template" size="xl" hide-footer>
              <template #modal-title>
                <div class="modal-title">
                  {{ template.name }}
                </div>
              </template>
              <ViewTemplate :template="template" :index="index"></ViewTemplate>
            </b-modal>
            <b-button v-on:click="selectTemplate(template.tID)" class="template-nav-button">Select</b-button>
          </div>
        </div>
        <div class="w-100">
          <div class="d-flex align-items-end justify-content-between">
            <div :id="'tag-container-' + template.tID" :title="template.tags"
              class="d-flex flex-wrap justify-content-start list tag-button-container">
              <label v-for="tag in template.tags" class="tag-button-child">{{ tag }}</label>
            </div>
            <span v-if="tagsOverflowing[index]" :title="template.tags" style="font-style:italic; color: #BEBEBE;">...
              And other tags</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ViewTemplate from './ViewTemplate.vue';

export default {
  name: 'ListViewTemplate',
  components: {
    ViewTemplate
  },
  props: ['templates'],
  data() {
    return {
      tagsOverflowing: [],
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
    this.tagsOverflowing = Array(this.templates.length).fill(false);
    this.resizeHandler();
  },
  unmounted() {
    window.addEventListener('resize', this.resizeHandler);
  },
  methods: {
    modalId(index) {
      return 'view-template' + index;
    },
    closeConfirmModal(index) {
      this.$bvModal.hide('view-template' + index)
    },
    selectTemplate(templateId) {
      let template = this.templates.find(template => {
        return template.tID === templateId
      })
      this.$emit('select-template', template)
    },
    resizeHandler() {
      this.templates.forEach((value, i) => {
        let element = document.getElementById('tag-container-' + value.tID)
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
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.list.tag-button-container {
  overflow-y: clip;
  width: 80%;
  max-height: 40px;
}

.modal-title {
  color: #FF7222;
  font-weight: bold;
}
</style>
