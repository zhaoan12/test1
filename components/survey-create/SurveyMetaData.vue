<template>
  <div class="main-div">
    <div class="survey-meta-data-form">
      <h4 v-if="adminOrDev == 1">Survey Name</h4>
      <h4 v-if="adminOrDev == 2">Template Name</h4>
      <b-form-input placeholder="Name" class="metadata-input" v-model="template.name"></b-form-input>
    </div>
    <div class="survey-meta-data-form">
      <h4 v-if="adminOrDev == 1">Survey Description</h4>
      <h4 v-if="adminOrDev == 2">Template Description</h4>
      <b-form-input placeholder="Description" class="metadata-input" v-model="template.description"></b-form-input>
    </div>

    <div class="survey-meta-data-form">
      <h4 v-if="adminOrDev == 1">Survey Tags</h4>
      <h4 v-if="adminOrDev == 2">Template Tags</h4>
      <p class="grey-text">Choose tags for the template - this will make it easier for developers to find the template</p>
      <hr>
      <div class="tag-space">
        <div class="clear-all-wrapper">
          <b-button class="clear-all-button" v-on:click="clearAllTags()">Clear All</b-button>
        </div>
        <div class="selected-tags">
          <b-button v-for="element in template.tags" :key="'template-tag-' + element" class="tag-button-chosen" v-on:click="removeSelectedTag(element)"> 
            <div class="chosen-text">{{ element }}
            </div>
            <div class="x">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
					  	<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
					  </svg>
            </div>
          </b-button>
        </div>
      </div>
      <hr>
      <div class="tag-parents">
        <b-button v-for="(item, i) in tagObject" :key="item.tag + '-parent-' + i" class="tag-button-parent"
        :style="{color: item.status ? '#FF7222 !important' : 'black'}" 
        v-on:click="toggleParent(item), displayComponent(item.title)">{{ item.title }}
        </b-button>
      </div>
      <hr>
      <div class="tag-children">
        <b-button v-for="(item, i) in currArray" :key="item.tag + '-child-' + i" class="tag-button-child" 
        :style="{backgroundColor: item.selected ? '#DB3360 !important' : '#F4BECC'}" 
        :id="item" v-on:click="displaySelected(item)">{{ item.tag }}</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SurveyMetaData',
  props: {
        adminOrDev: Number, // 1 is dev, 2 is admin
        template: Object
    },
  data() {
    return {
      //tagObject holds all the data for tag categories and their subtags. will be imported from database in future?
      tagObject: [
        {title: 'Mechanics', status: true, tagsArr: ["Playability", "Combat", "Mechanics", "Indicators", "Environment", "Skill Tree", "Enemies", "Puzzles"]}, 
        {title: 'Usability', status: false, tagsArr: ["UI", "Controls", "Audio", "Dialogue", "Help", "Text", "Usability", "Menus" ]},
        {title: 'Systems', status: false, tagsArr: ["Map", "Customization", "Goals", "Navigation", "Tutorial", "Onboarding", "Objectives", "Level Design"]},
        {title: 'Design', status: false, tagsArr: ["Character", "Story", "NPC", "Art", "Music"]},
        {title: 'Performance', status: false, tagsArr: ["Balance", "Pacing", "Skill", "Immersion", "Difficulty", "Fun"]}
      ],
      // currArray dynamically changes to hold info for the tags belonging to the current category (placeholder, replace static data when integrating backend)
      currArray: [
        {tag: "Playability", selected: false},
        {tag: "Combat", selected: false}, 
        {tag: "Mechanics", selected: false}, 
        {tag: "Indicators", selected: false}, 
        {tag: "Environment", selected: false}, 
        {tag: "Skill Tree", selected: false}, 
        {tag: "Enemies", selected: false},
        {tag: "Puzzles", selected: false}],
      selectedArray: [], // array that dynamically changes to hold info for displaying selected tags
      selectedCategory: "Genre", // the current selected category (placeholder, replace static data when integrating backend)

    };
  },
  mounted() {
    this.displayComponent("Genre");
  },
  methods: {
    displayComponent(categoryInput){
      this.selectedCategory = categoryInput;
      this.tagObject.forEach( o =>{
        if (o.title === categoryInput){
          this.currArray = [];
          for(let i = 0; i<o.tagsArr.length; i++){
            if(this.template.tags.includes(o.tagsArr[i])){
            this.currArray.push({tag: o.tagsArr[i], selected: true});
            } else {
              this.currArray.push({tag: o.tagsArr[i], selected: false});
            }
          }
        }
      });
    },
    displaySelected (elementID) {
      const index = this.currArray.indexOf(elementID);
      this.currArray[index].selected = true;
      if(!this.template.tags.includes(elementID.tag)){
        this.template.tags.push(elementID.tag);
      }
    },
    clearAllTags () {
      this.template.tags = [];
      this.currArray.forEach( o =>{
        o.selected = false;
      });
    },
    removeSelectedTag(elementToRemove) {
      const index = this.template.tags.indexOf(elementToRemove);
      this.template.tags.splice(index, 1);
      this.currArray.forEach( o =>{
        if (o.tag === elementToRemove){
          o.selected = false;
        }
      });
    },
    calculateNumTags () {
      let sumTemp = 0;
      this.tagObject.forEach( o =>{
        sumTemp ++;
      });
      this.maxChildrenTags = sumTemp;
    },
    toggleParent(element) {
      for(let i = 0; i<this.tagObject.length;i++){this.tagObject[i].status = false;}
      const index = this.tagObject.indexOf(element);
      if (!this.tagObject[index].status) {
        this.tagObject[index].status = true;
      } else {
        this.tagObject[index].status = false;
      }
    },
  }
}
</script>

<style scoped>
:root {
  --tag-height: 35px;
}
.main-div{
  background-color: #eee;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.survey-meta-data-form{
  display: inline-block;
  width: 80%;
  background-color: #fff;
  padding: 1.5rem 3rem;
  margin: 1rem 0.5rem 0 0.5rem;
  border-radius: 30px;
  text-align: left;
}
.survey-meta-data-form:nth-of-type(3){
  margin-bottom: 2%;
  min-height: 400px;;
}
.metadata-input {
  width: 95% !important;
  margin: 0.5rem !important;
  background-color: #eee !important;
  border: 0 !important;
}
h4 {
  color: #FF7222;
  margin-left: 1% !important;
  font-weight: bold !important;
  margin-top: 1% !important;
  margin-bottom: 0.8% !important;
}
p.grey-text {
  color: #bbb !important;
  margin-left: 1%;
  margin-top: -0.8%;
}
hr {
  width: 95%;
  margin-left: 1%;
  border: 1px solid #ccc !important;
  background-color: #eee !important;
}
hr:nth-of-type(1){
  margin-top: -10px;
}
.tag-space {
  display: flex;
}
.selected-tags {
  width: 85%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.tag-button-chosen{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: var(--tag-height); 
  margin: 0.3% 0.5%;
  background-color: #DB3360 !important;
}
.tag-button-chosen:hover {
  font-weight: bold;
}
.chosen-text{
  min-width: fit-content;
}
.x {
  width: 10%;
}
.tag-parents {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-evenly;
  margin: -1% auto; 
}
.tag-children {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.clear-all-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
}
.clear-all-button {
  background-color: #e5e5e5 !important;
  height: var(--tag-height);
  width: 80%;
  color: #000 !important;
}
.clear-all-button:hover {
  background-color:  #5c636a !important;
  color: #fff !important;
}
.tag-button-parent {
  color: black;
  font-weight: bold;
}
.tag-button-child {
  background-color: #F4BECC !important;
  height: var(--tag-height);
  margin: 0.3% 0.5% !important;
  padding: auto 3%;
}
.clear-all-button, .tag-button-parent, .tag-button-chosen, .tag-button-child {
  border-radius: 10px;
  border: none;
  font-size: 90% !important;
}
.tag-button-parent:hover {
	color: #FF7222 !important;
}
.tag-button-child:hover {
	background-color: #DB3360 !important;
}
</style>