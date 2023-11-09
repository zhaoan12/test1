<template>
  <div class='d-flex'>
    <navigator class="navigator" :flag="navFlag" />

    <div class="template-page">
      <div>
        <transition name="fade">
          <Loading v-if="isLoading"></Loading>
        </transition>
      </div>

      <div class="title-header">
        <h1>Templates</h1>
      </div>


      <div v-if="this.allTemplates.length > 0" class="templates">
        <TemplateItem v-for="temp in this.allTemplates" :key="temp.id" :templateName="temp.name"
          :survey_question="temp.questions" :templateID="temp.id" :access="temp.access"
          v-on:removeTemplate="removeTemplate" />
      </div>
      <div v-else class="project-num">CURRENTLY NO TEMPLATES</div>

      <b-button class="add-new-project" v-on:click="addProject()">
        Add New Template
      </b-button>
    </div>
  </div>
</template>

<script>
import navigator from '../layout/NavBarNew.vue'
import TemplateItem from "./TemplateItem";
import Template from "../../Firestore/Template";
import Loading from '../loading/index.vue';

export default {
  name: "Templates",
  components: {
    TemplateItem,
    navigator,
    Loading,
  },
  data() {
    return {
      msg: "projects",
      navFlag: 1,
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin,
      allTemplates: []
    }
  },
  mounted() {
    if (window.localStorage.getItem("userType")) {
      this.userType = parseInt(window.localStorage.getItem("userType"));
      this.getTemplates()
    } else {
      this.$router.push({
        name: 'login',
      })
    }
  },
  methods: {
    getTemplates() {
      Template.getAllTemplates()
        .then(res => {
          this.allTemplates = res.data.map(temp => {
            return {
              id: temp.tID,
              questions: temp.questionIDs,
              name: temp.name,
              access: temp.access
            }
          })
        })
    },
    removeTemplate(templateID) {
      let res = Template.deleteTemplate(templateID);
      res.then(response => {
        if (response.exist) {
          this.getTemplates();
        } else {
          alert(res.statusText)
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    addProject: function () {
      this.$router.push({
        name: 'createSurvey',
      })
    },
  }
}
</script>

<style>
.template-page {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background-color: #EEEEEE;
}

.title-header {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
  box-shadow: 0 4px 10px -6px grey;
}

.title-header h1 {
  color: #FF7222;
  font-weight: bold;
}

::-webkit-scrollbar {
  width: 5px;
  height: 100%;
  border-radius: 10px;
  background: #36393F;
}

::-webkit-scrollbar-thumb {
  width: 5px;
  background: #E9E9EA;
  border-radius: 10px;
}

.templates {
  margin-top: 130px;
  width: 100%
}

.project-num {
  position: absolute;
  top: 110px;
  left: 46px;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 15px;
  color: #FC7727;
}

.add-new-project {
  position: absolute;
  height: 15px;
  top: 160px;
  right: 0px;
  background: #FF7222 !important;
  border: 0 !important;
  margin: 0.5rem;
  height: 2rem;
  float: right;
  display: flex;
  align-items: center;
}
</style>
