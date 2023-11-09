<template>
  <div id="search-surveys" class="wrap" :style="{ minWidth: wrapperMinWidth }">
    <div class="fixed-container w-80">
      <div id="header-card">
        <div class="card-head-container">
          <div class="card-title-container">
            <h4>Search For Surveys</h4>
          </div>
        </div>
        <div class="w-100 header-card-content">
          <b-form-input v-model="searchTerm" placeholder="Search by name" class="text-input"></b-form-input>
          <div class="card-title-container">
            <h6 class="adv-search-title">Advanced Search</h6>
          </div>
          <hr class="divider" />
          <div class="d-flex flex-wrap justify-content-start tag-selector">
            <b-button v-on:click="clearAllTags()" class="clear-all-button">Clear All</b-button>
            <b-button v-for="element in selectedTags" :key="element" class="tag-button-chosen"
              v-on:click="removeSelectedTag(element)">{{ element }}</b-button>
          </div>
          <hr class="divider" />
          <b-dropdown id="dropdown-1" text="Search by tag" class="text-input w-100">
            <div v-for="(tagNames, category, index) in tags">
              <div class="dropdown-category">
                {{ category }}
              </div>
              <div class="ms-2">
                <label v-for="tag in tagNames" v-on:click="addSelectedTag(tag)" class="dropdown-item">{{ tag
                }}</label>
              </div>
            </div>
          </b-dropdown>
          <div class="d-flex justify-content-end">
            <div id="gridview" v-if="!gridView" v-on:click="setGridView()" class="clickable-icon">
              <span class="icon-text">Grid View</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grid"
                viewBox="0 0 16 16">
                <path
                  d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
              </svg>
            </div>
            <div id="listview" v-if="gridView" v-on:click="setListView()" class="clickable-icon">
              <span class="icon-text">List View</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
              </svg>
            </div>
            <div id="sort" class="clickable-icon">
              <span class="icon-text">Sort By</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-up"
                viewBox="0 0 16 16">
                <path
                  d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GridViewSurvey v-if="gridView" :surveys="searchSurvey" @delete-survey="deleteSurvey"></GridViewSurvey>
    <ListViewSurvey v-if="!gridView" :surveys="searchSurvey" @delete-survey="deleteSurvey"></ListViewSurvey>
  </div>
</template>

<script>
import GridViewSurvey from './search-surveys-components/GridViewSurvey.vue';
import ListViewSurvey from './search-surveys-components/ListViewSurvey.vue';
import Surveys from "./Surveys.vue";
import Template from "../../Firestore/Template";
export default {
  components: {
    GridViewSurvey,
    ListViewSurvey
  },
  name: 'SearchSurveys',
  data() {
    return {
      userId: window.localStorage.getItem('userId'),
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Developer, 2: Admin
      selectedTags: [], // array that dynamically changes to hold info for displaying selected tags
      gridView: false,
      tags: {
        "Mechanics": ["Playability", "Combat", "Mechanics", "Indicators", "Environment", "Skill Tree", "Enemies", "Puzzles"],
        "Usability": ["UI", "Controls", "Audio", "Dialogue", "Help", "Text", "Usability", "Menus" ],
        "Systems": ["Map", "Customization", "Goals", "Navigation", "Tutorial", "Onboarding", "Objectives", "Level Design"],
        "Design": ["Character", "Story", "NPC", "Art", "Music"],
        "Performance": ["Balance", "Pacing", "Skill", "Immersion", "Difficulty", "Fun"]
      },
      surveys: [],
      searchTerm: '',
    }
  },
  computed: {
    searchSurvey() {
      let finalSurveys = this.surveys.filter(template =>
        template.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        this.selectedTags.every(tag => template.tags.includes(tag))
      )
      return finalSurveys;
    },
    wrapperMinWidth() {
      if (this.gridView) {
        return '650px'
      } else {
        return '500px'
      }
    },
  },
  mounted() {
    // grab all surveys from backend here, set result to this.template
    if (this.userType == 1) {
      Surveys.getDeveloperSurveys(this.userId).then(res => {
        this.surveys = res.data
      })
    } else if (this.userType == 2) {
      Template.getAllSurveys().then(res => {
        this.surveys = res.data
      })
    }
  },
  methods: {
    setGridView() {
      this.gridView = true;
    },
    setListView() {
      this.gridView = false;
    },
    addSelectedTag(tagName) {
      if (!this.selectedTags.includes(tagName)) {
        this.selectedTags.push(tagName)
      }
    },
    removeSelectedTag(tagName) {
      const index = this.selectedTags.indexOf(tagName);
      this.selectedTags.splice(index, 1);
    },
    clearAllTags() {
      this.selectedTags = [];
    },
    deleteSurvey(survey) {
      Template.deleteSurvey(survey.sID).then(res => {
        console.log(res)
      })
      Surveys.getDeveloperSurveys(this.userId).then(res => {
        this.surveys = res.data
      })
    },
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

::before,
::after {
  box-sizing: inherit;
}

.wrap {
  width: 100%;
  margin: 0px;
  padding: 1rem 1rem;
  height: 100vh;
  max-height: 100%;
  display: flex;
  flex-direction: row;
  overflow: none;
  justify-content: space-evenly;
  align-items: start;
  gap: 0px 1rem;
}

.fixed-container {
  background-color: #EEEEEE;
  width: 35%;
  max-width: 606px;
  min-width: 200px;
  height: 100%;
}

div.template-container {
  width: 65%;
  min-width: 200px;
  margin: 0px auto;
  justify-content: space-evenly;
  flex-direction: row;
  padding: 0px 0px;
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto !important;
  overflow-x: clip;
  min-height: 330px;
  max-height: 100%;
}

div.template-container .card-container div {
  margin-top: 0px;
}

#header-card {
  margin: 0px 0px;
  width: 100%;
  height: 100%;
  min-height: 270px;
  padding: 1rem 2rem;
  background-color: white;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem 0px;
}

.header-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.55rem 0px;
}

.card-head-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0px;
}

.card-title-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

h4.survey-title {
  font-size: large;
  margin-top: 2px !important;
  margin-bottom: 5px !important;
  max-height: 1.4rem !important;
  color: #FF7222 !important;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

h6.survey-title {
  margin-top: 2px !important;
  margin-bottom: 5px !important;
  max-height: 1.4rem !important;
  padding-right: 3px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.template-buttons {
  min-width: fit-content;
}

.text-input.form-control {
  background-color: #eee !important;
  border-radius: 10px !important;
  color: #8e8e8e !important;
  border: none;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.adv-search-title {
  font-weight: bold !important;
  color: #FF7222 !important;
}

#search-surveys div.tag-selector .btn.clear-all-button {
  background-color: #e5e5e5 !important;
  color: #000 !important;
}

div.tag-selector .btn.clear-all-button:active,
div.tag-selector .btn.clear-all-button:hover {
  background-color: #5c636a !important;
  color: #fff !important;
}

div.tag-selector .btn.clear-all-button,
#search-surveys .btn.tag-button-chosen,
label.tag-button-child {
  border-radius: 10px;
  border: none;
  font-size: 90% !important;
  font-weight: bold !important;
  padding: 0.5rem 0.5rem;
  margin: 3px 0.5rem 3px 0rem;
}

label.tag-button-child {
  background-color: #DB3360 !important;
  color: white;
  height: 35px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  justify-content: center;
  align-items: center;
}

#search-surveys .btn.tag-button-chosen {
  background-color: #DB3360 !important;
  color: white !important;
}

#search-surveys .btn.tag-button-chosen:hover {
  padding: 0.5rem 1rem;
  background-color: #DB3360 !important;
}

.divider {
  margin: 0.3rem 0px;
}

div.dropdown-category {
  margin: 0px 0.3rem;
  padding: 0px 0.2rem;
  background-color: #F4BECC;
  border-radius: 10px;
  color: white;
  user-select: none;
}

ul.dropdown-menu {
  width: 100%;
  max-height: 30rem;
  overflow: auto;
  border: none;
  box-shadow: 0 4px 6px -2px grey;
}

.btn.dropdown-toggle {
  color: #8e8e8e !important;
  text-align: start;
  background-color: #eee !important;
  border: none !important;
}

#search-surveys .btn.tag-button-chosen {
  color: white !important;
}

#dropdown {
  padding: 6px 12px;
}

#dropdown-content {
  display: none;
}

#dropdown:active,
#dropdown:focus #dropdown-content {
  display: block;
}

label.dropdown-item {
  padding-top: 2px;
  padding-bottom: 2px;
}

label.dropdown-item:hover {
  cursor: pointer;
  user-select: none;
}

div.card-head-container .nav-button {
  margin: 0rem 0.3rem;
  padding: 0.2rem 0.8rem;
}

div.clickable-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 5px;
}

div.clickable-icon:hover {
  cursor: pointer;
  background-color: #cecece;
}

span.icon-text {
  font-style: italic;
  color: #000;
  margin-right: 5px;
  font-size: small;
}

.btn.template-nav-button {
  background: #FF7222 !important;
  margin: 5px;
  border: 0 !important;
  padding: 0.3rem 0.5rem;
}

.delete-button {
  background: #FF7222 !important;
  margin: 5px;
  border: 0 !important;
  position: relative;
}

.delete-button:hover {
  background: #ff8e4d !important;
}

.delete-button:focus,
.delete-button:active {
  background: #FF7222 !important;
}

.close-button {
  background: #6c757d !important;
  margin: 5px;
  border: 0 !important;
  position: relative;
}

.close-button:hover {
  background: #848d94 !important;
}

.close-button:focus,
.close-button:active {
  background: #6c757d !important;
}

.confirm-modal-text {
  color: black !important;
  margin: 0.5rem;
}

@media screen and (min-height: 900px) {
  .inner-surveys-container:has(div div.wrap) {
    overflow: hidden;
  }
}

@media screen and (max-height: 900px) {
  .inner-surveys-container:has(div div.wrap) {
    overflow: auto;
  }
}

@media screen and (min-width: 1785px) {
  div.template-container {
    width: calc(100% - 606px)
  }
}
</style>
