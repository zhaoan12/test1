<template>
    <div class="d-flex">
        <navigator :flag="navFlag" />
        <div class="dashboard-page">
            <div class="title-header">
                <h1 v-if="userType == 2">Projects</h1>
                <h1 v-else> My Projects </h1>
            </div>

            <div class="p-3">
                <div class="projects-search-bar">
                    <b-form-input v-model="searchTerm" placeholder="Search by name" class="text-input"></b-form-input>
                </div>

                <b-button v-if="userType == 1" class="new-project-button" v-on:click="addProject()">
                    Add New Project
                </b-button>

                <div v-if="filteredProjects.length == 0" class="dashboard-no-project">
                    <img src="../../assets/Not Found.png" class="dashboard-no-project-img">
                    <div>No projects found</div>
                </div>

                <ProjectCardsTester v-else-if="userType == 0" :projects="filteredProjects"/>
                <ProjectCardsDev v-else-if="userType == 1" :projects="filteredProjects"/>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectCardsTester from './ProjectCardsTester.vue'
import ProjectCardsDev from './ProjectCardsDev.vue'
import navigator from '../layout/NavBarNew.vue'
import Loading from '../loading/index.vue'
import Firestore from '../../Firestore'

export default {
    name: "Projects",
    components: {
        navigator,
        ProjectCardsDev,
        ProjectCardsTester,
        Loading
    },
    data() {
        return {
            totalGames: 0,
            isLoading: false,
            navFlag: 0,
            userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1, // 0: Tester, 1: dev, 2: Admin
            userAvator: require('../../assets/avator_example.jpg'),
            searchTerm: '',
            projects: []
        }
    },
    computed: {
        filteredProjects: {
            get() {
                return this.projects.filter(proj => 
                    proj.gameName.toLowerCase().includes(this.searchTerm.toLowerCase())
                )
            },
            // don't think this does anything now, but its here bc I'm getting an error without it
            set(projs) {
                return projs
            }
        }
    },
    mounted() {
        // redirect to login if the user is not logged in
        if (window.localStorage.getItem("userType")) {
            this.userType = parseInt(window.localStorage.getItem("userType"));
        } else {
            this.$router.push({
                name: 'login',
            })
        }
        this.getProjects();
    },
    methods: {
        getProjects() {
            this.isLoading = true;
            if (this.userType == 0) { // tester
                Firestore.getTesterProjects(window.localStorage.getItem('userId'))
                .then(res => {
                    this.projects = res.data;
                    this.filteredProjects = res.data;
                    this.isLoading = false;
                })
                .catch(err => {
                    console.error(err);
                    this.isLoading = false;
                })
            } else if (this.userType == 1) { // dev
                Firestore.getDevProjects(window.localStorage.getItem('userId'))
                .then(res => {
                    this.projects = res.data;
                    this.filteredProjects = res.data;
                    this.isLoading = false;
                })
                .catch(err => {
                    console.error(err);
                    this.isLoading = false;
                })
            }
        },
        addProject() {
            this.$router.push({
                name: 'addgame',
            })
        }
    }
}
</script>

<style scoped>
.dashboard-page {
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

.projects-search-bar {
    margin: 0.5rem;
}

.text-input.form-control {
  background-color: white !important;
  border-radius: 10px !important;
  color: #8e8e8e !important;
  border: none;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.dashboard-no-project {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-top: 10%;
}

.dashboard-no-project-img {
    width: 10%;
}

.new-project-button {
    background: #FF7222 !important;
	border: 0 !important;
    margin: 0.5rem;
	height: 2rem;
    float: right;
    display: flex;
    align-items: center;
}
</style>
