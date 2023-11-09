<template>
    <div class="projects-container">
        <div v-for="(project, i) in projects" class="project-card">
            <img v-if="project.img != ''" class="project-img" :src="project.img" />
            <div class="project-card-right">
                <div class="project-info">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-column">
                            <div class="project-name"> {{ project.gameName }}</div>
                            <div class="project-company"> {{ project.gameStudio }} </div>
                        </div>

                        <!-- trash can icon -->
                        <b-button class="bg-transparent border-0 text-muted" v-b-modal="modalId(i)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </b-button>
                        <!-- Delete confirm modal - opens when the above button is clicked -->
                        <b-modal :id="'delete-confirm-' + i" centered title="Confirm">
                            <p class="confirm-modal-text">Are you sure you would like to delete {{ project.gameName }}?</p>
                            <template #modal-footer>
                                <div class="d-flex float-right">
                                    <b-button class="primary-button" v-on:click="() => deleteProject(project.gameId)">
                                        Delete
                                    </b-button>
                                </div>
                            </template>
                        </b-modal>
                    </div>
                </div>
                <div class="project-buttons">
                    <b-button class="primary-button" v-on:click="viewDetails(project.gameId)">
                        View Details
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Firestore from '../../Firestore';
import GamesObject from "../../Firestore/GamesObject";

export default {
    name: "ProjectCardDev",
    props: {
        projects: Array
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
        viewDetails(gameId) {
            // Set Game ID
            window.localStorage.setItem('gameId', gameId);
            window.localStorage.setItem("gameDetailIndex", 0);
            // Go to game detail section
            this.$router.push({
                name: 'gamedetail',
            })
        },
        modalId(i) {
            return 'delete-confirm-' + i;
        },
        deleteProject(gameId) {
            GamesObject.deleteGame(gameId)
            .then(() => {
                this.$bvModal.hide("delete-confirm");
                this.projects = this.projects.filter(p => p.gameId != gameId);
            })
            .catch(err => {
                console.error(err);
            })
        }
    },
}
</script>

<style scoped>
.projects-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}

.project-card {
    background-color: white;
    border-radius: 10px;
    margin: 0.5rem;
    padding: 1rem;
    display: flex;
    width: 100%;
}

.project-img {
    width: 30%;
    height: auto;
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
}

.primary-button {
	background: #FF7222 !important;
	border: 0 !important;
	height: 2rem;
    display: flex;
    align-items: center;
}

button.primary-button:hover {
	background: #ff8e4d !important;
}

.primary-button:active, .primary-button:focus {
	background: #FF7222 !important;
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

<style scoped>
button {
	border: 0 !important;
	background-color: transparent !important;
}
</style>
