<template>
    <div class="d-flex">
        <navigator></navigator>
        <div id='gamedetail-page'>
            <div class="title-header">
				<h1> Project Details </h1>
			</div>
            <!-- <div>
                <transition name="fade">
                    <Loading v-if="isLoading"></Loading>
                </transition>
            </div> -->

            <div class="content-wrapper">
                <sidebar
                id="gamedetail-sidebar"
                :sideBarType="0"
                @clicked="onClickSidebar" />

                <div class="main-content">
                    <div class="game-detail-analysis-wrapper" v-if="idx == 0 && showTitle">
                        <router-view :detail="detail"/>
                    </div>

                    <div class="game-detail-analysis-wrapper" v-if="idx == 1">
                        <router-view :detail="detail"/>
                    </div>

                    <div class="game-detail-analysis-wrapper" v-if="idx == 2">
                        <router-view :detail="detail"/>
                    </div>

                    <div class="game-detail-analysis-wrapper" v-if="idx == 3">
                        <router-view :detail="detail"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import navigator from '../layout/NavBarNew.vue'
    import sidebar from '../layout/SideBar.vue'
    import gameTester from './GameTester.vue'
    import Loading from '../loading/index.vue'
    import Firestore from '../../Firestore'
    import GamesObject from "../../Firestore/GamesObject";
    export default {
        name: "gamedetail",
        components: {
            navigator,
            sidebar,
            gameTester,
            Loading
        },
        data() {
            // Return the game detail object which holds all details of a game such as its ID and name.
            return {
                msg: "gamedetail",
                showTitle: false,
                isLoading: false,
                navFlag: -1,
                // Set user type to -1 since it is not set yet
                userType: -1,  // 0: Tester, 1: Company, 2: Admin
                idx: 0,
                // All game details
                detail: {
                    gameId: "",
                    gameName: "",
                    company: "",
                    img: "",
                    endTime: "",
                    description: "",
                    // QA lead for the game
                    qaLead: {
                        name: "",
                        workPhone: "",
                        mobile: "",
                        email: "",
                    },
                    // Number of testers for the game
                    testerNum: 0,
                    // List of IDs of all testers for the game
                    testerIds: [],
                    analysis: {},
                    recordings: {},
                },
            }
        },
        mounted() {
            let that = this;
            // If valid logged in user
            if (window.localStorage.getItem("userType")) {
                // Set user
                this.userType = parseInt(window.localStorage.getItem("userType"));
                this.isLoading = true;
                // Get project which is associated gameId
                GamesObject.getProject(window.localStorage.getItem("gameId"))
                .then(res => {
                    this.project = res.data
                    this.isLoading = false;
                    that.detail = res.data;
                    that.showTitle = true;
                })
                .catch(error => {
                console.log(error);

            });
            // User not logged in
            } else {
                this.$router.push({
                    name: 'login',
                })
            }
        },
        methods: {
            onClickSidebar(index) {
                this.idx = index;
            },
        },
    }
</script>

<style scoped>
#gamedetail-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #F5F5F5;
}

::-webkit-scrollbar {
    width: 5px;
    height: 100%;
    background: #595B60;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    width: 5px;
    background: #E9E9EA;
    border-radius: 10px;
}

.content-wrapper {
    width: 100%;
    height: 100%;
    margin-top: 5rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

@media only screen and (max-width: 1330px) {
  .content-wrapper {
    position: fixed;
    overflow-x: scroll;
    width: 1330px;
  }
}

#gamedetail-sidebar {
    width: 20%;
    height: 80%;
    display: inline-block;
    vertical-align: top;
    background-color: transparent;
}

.main-content {
    width: 82%;
    height: 80%;
    display: inline-block;
    vertical-align: top;
    margin: 0 2rem 0 2rem;
}

.game-detail-analysis-wrapper {
    height: 100%;
    width: 100%;
}

.title-header {
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 75px;
	width: 100%;
}

.title-header h1 {
	color: #FF7222;
	font-weight: bold;
}
</style>
