<template>
    <div class="projects-container">
        <div v-for="(project, i) in projects" class="project-card">
            <div class="card-container">
                <img v-if="project.img != ''" class="project-img" :src="project.img" />
                <div class="project-card-right">
                    <div class="project-info">
                        <div class="project-name"> {{ project.gameName }}</div>
                        <div class="project-company"> {{ project.gameStudio }} </div>
                    </div>
                    <div class="project-buttons">
                        <b-button class="project-button" v-on:click="goToSurveys(project.gameId, project.gameName)">
                            Surveys
                            <span v-if="numIncompleteResponses[i] && numIncompleteResponses[i] > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-danger notif-badge">
                                {{ numIncompleteResponses[i] }}
                            </span>
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Response from '../../Firestore/Response';

export default {
    name: "ProjectCardsTester",
    props: {
        projects: Array
    },
    data() {
        return {
            userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
            numIncompleteResponses: []
        }
    },
    mounted() {
        this.userType = parseInt(window.localStorage.getItem("userType"));
        this.projects.forEach(project => {
            Response.getIncompleteResponsesByTesterProject(window.localStorage.getItem('userId'), project.gameId)
            .then(res => {
                this.numIncompleteResponses.push(res.data.length)
            })
        })
    },
    methods: {
        goToSurveys(gameId, gameName) {
            window.localStorage.setItem('gameId', gameId);
            window.localStorage.setItem('gameName', gameName)
            // Go to survey section
            this.$router.push({
                name: 'project-surveys'
            })
        }
    },
}
</script>

<style scoped>
.projects-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.project-card {
    background-color: white;
    border-radius: 10px;
    margin: 0.5rem;
}

.project-img {
    width: 30%;
    height: auto;
}

.card-container {
    display: flex;
    padding: 1rem;
}

.project-card-right {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    width: 100%;
    justify-content: space-between;
}

.project-name {
    color: #FF7222 !important;
    font-weight: bold;
    font-size: large;
}

.project-company {
    color: lightgray !important;
	font-style: italic;
}

.project-buttons {
    display: flex;
    justify-content: flex-end;
    position: relative;
}

.project-button {
	background: #FF7222 !important;
	border: 0 !important;
	height: 2rem;
    display: flex;
    align-items: center;
}

button.project-button:hover {
	background: #ff8e4d !important;
}

.project-button:active, .project-button:focus {
	background: #FF7222 !important;
}

.notif-badge {
    background-color: #ff4d4d !important;
    border: 1px solid white !important;
}

@media only screen and (max-width: 1200px) and (min-width: 700px) {
    .project-card { 
        width: calc(50% - 1rem) !important; /* fit 2 cards on screen */
    }
}

@media only screen and (min-width: 1200px) {
    .project-card {
        width: calc(33.3333333333% - 1rem) !important; /* fit 3 cards on screen */
    }
}
</style>