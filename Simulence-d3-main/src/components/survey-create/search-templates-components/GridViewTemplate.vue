<template>
  <div class="template-container">
    <div v-for="(template, index) in templates" class="grid card-container">
      <div class="w-100">
        <div class="card-head-container align-items-start">
          <h4 class="template-title" :title="template.name">{{ template.name }}</h4>
        </div>
        <div class="w-100">
          <div class="d-flex justify-content-between align-items-end">
            <p :title="template.description" class="grid description-container">{{
              template.description }}</p>
          </div>
          <div class="d-flex align-items-end justify-content-between">
            <div :id="'tag-container-' + template.tID" :title="template.tags"
              class="d-flex flex-wrap justify-content-start grid tag-button-container">
              <label v-for="tag in template.tags" class="tag-button-child">{{ tag }}</label>
            </div>
          </div>
          <span v-if="tagsOverflowing[index]" :title="template.tags" style="font-style:italic; color: #BEBEBE;">...
            And other tags</span>
        </div>
      </div>
      <div class="w-100 d-flex justify-content-end align-items-center">
        <div class="d-flex justify-content-end">
          <b-button class="template-nav-button" v-b-modal="modalId(index)">View</b-button>
          <!-- View template modal - opens when the above button is clicked -->
          <b-modal :id="'view-template' + index" title="View Template" size="xl" hide-footer>
            <div class="modal-title">
              {{ template.name }}
            </div>
            <ViewTemplate :template="template" :index="index"></ViewTemplate>
          </b-modal>
          <b-button v-on:click="selectTemplate(template.tID)" class="template-nav-button">Select</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ViewTemplate from './ViewTemplate.vue';

export default {
  name: 'GridViewTemplate',
  components: {
    ViewTemplate
  },
  props: ['templates',],
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
