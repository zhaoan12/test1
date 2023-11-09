<template>
  <div class="template-item">
    <div>
      {{ updateColor() }}
    </div>
    <div v-if="this.access === 1"><b-badge class="tag" pill>Public</b-badge> Template Name:
      <strong>{{ this.templateName }}</strong></div>
    <div v-if="this.access === 2"><b-badge class="tag" pill>Private</b-badge> Template Name:
      <strong>{{ this.templateName }}</strong></div>
    <div><p class="questions-header">Questions:</p></div>
    <SurveyTemplate class="question-viewer" :questions="this.survey_question" :isEditable="false"></SurveyTemplate>
    <b-button class="remove-template" v-on:click="() => { removeTemplate(templateID) }">Remove Template</b-button>
  </div>
</template>

<script>
import SurveyTemplate from "../admin-only/SurveyTemplate.vue"

export default {
  name: "TemplateItem",
  components: {
    SurveyTemplate
  },
  props: {
    templateName: {
      type: String
    },
    survey_question: [],
    templateID: "",
    access: ""
  },
  data() {
    return {
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
    }
  },
  mounted() {
    this.userType = parseInt(window.localStorage.getItem("userType"));
  },
  methods: {
    removeTemplate(templateID) {
      this.$emit("removeTemplate", templateID)
    },

    updateColor: function () {
      var r = document.querySelector(':root');
      r.style.setProperty('--TEMPLATE_ITEM_BORDER', this.$store.state.templateItem_border);
      r.style.setProperty('--TEMPLATE_ITEM_BACKGROUND', this.$store.state.templateItem_background);
    },
  },
}
</script>

<style>
:root {
  --TEMPLATE_ITEM_BORDER: #fbfbfb;
  --TEMPLATE_ITEM_BACKGROUND: #fbfbfb;

}
.questions-header {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  color: #FF7222 !important;
  font-weight: bold;
  font-size: large;
}

/* There might be some additional stuff in the question viewer, however, they are all empty currently and im not sure how they display */
.question-viewer {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.template-item {
  position: relative;
  width: 98%;
  margin-top: 38px;
  margin-left: 1%;
  margin-right: 1%;
  border: 1px solid var(--TEMPLATE_ITEM_BORDER);
  box-sizing: border-box;
  border-radius: 10px;
  /* background-color: var(--TEMPLATE_ITEM_BACKGROUND); */
  background-color: white;
}

.remove-template {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  background: #FF7222;
}

.tag {
  color: white;
  background: #FF7222;
  
}

</style>