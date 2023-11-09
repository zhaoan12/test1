<template>
    <div class="side-navbar">
        <div>
            {{updateColor()}}
        </div>
        <div v-if="newSurvey == 1" class="notification-dot"></div>
        <b-sidebar visible no-header noCloseOnRouteChange bg-variant="dark" text-variant="light" shadow>
            <template>
                <div class="simulence-logo-sidebar"><img src="../../assets/Simulence_logo.png" id="logo-img"></div>
                <b-nav vertical class="side-navbar-item">
                    <b-nav-item class="side-navbar-text" v-for="(tag, index) in navTags2" :key="tag.name" @click="changeTag(index)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="circle" viewBox="0 0 16 16">
                                <circle cx="6" cy="6" r="6"/>
                            </svg>
                            <div class="sidebar-tag-text">
                                {{ tag.name }}
                            </div>
                    </b-nav-item>
                </b-nav>
                <b-nav class="admin-item">
                    <div v-if="this.login" class="account-type" @click='goProfile'>
                        <div class="account-type-txt">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" class="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                            <div class="px-3">
                                Profile
                            </div>
                        </div>
                        <div class="logout-txt" @click="handleLogout">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                                <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                            </svg>
                            <div class="px-3">
                                Logout
                            </div>
                        </div>
                    </div>
                </b-nav>
            </template>
        </b-sidebar>
    </div>
</template>

<script>
// NOTE: THIS IS THE NEW NAVBAR (SIDEBAR)
    import Surveys from "../../Firestore/Surveys";
    import UserObject from "../../Firestore/UserObject";
    export default {
        name: "navigator",
        props: {
            flag: {
                type: Number
            },
        },
        data() {
            return {
                msg: "",
                userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,
                userAvatar: window.localStorage.getItem("userAvatar"),
                login: window.localStorage.getItem("userType") ? true : false,
                navTags2: [],
                newSurvey: window.localStorage.getItem("newSurvey"),
                testerNavTags: [
                    {
                        name: "Dashboard",
                        link: "dashboard",
                    }, {
                        name: "Test",
                        link: "test",
                    }, {
                        name: "Survey",
                        link: "survey",
                    }, {
                        name: "Calendar",
                        link: "calendar",
                    }
                ],
                companyNavTags: [
                    {
                        name: "Dashboard",
                        link: "dashboard",
                    }, {
                        name: "Test",
                        link: "test",
                    }, {
                        name: "Survey",
                        link: "survey",
                    }, {
                        name: "Calendar",
                        link: "calendar",
                    }
                ],
                adminNavTags: [
                    {
                        name: "Dashboard",
                        link: "dashboard",
                    }, {
                        name: "Templates",
                        link: "templates",
                    }, {
                        name: "Users",
                        link: "users",
                    },
                    {
                        name: "Surveys",
                        link: "adminsurveys",
                    }, {
                        name: "Calendar",
                        link: "calendar",
                    }
                ],
                windowWidth: window.innerWidth
            }
        },
        mounted() {
            if (parseInt(window.localStorage.getItem("userType")) == 0) {
                this.navTags2 = this.testerNavTags;
                this.checkForNewSurvey();
            } else if (parseInt(window.localStorage.getItem("userType")) == 1) {
                this.navTags2 = this.companyNavTags;
            } else if (parseInt(window.localStorage.getItem("userType")) == 2) {
                this.navTags2 = this.adminNavTags;
            }
        },
        methods: {
            changeTag: function(idx) {
                this.$router.push({
                    name: this.navTags2[idx].link,
                })
            },

            goProfile: function() {
                if ((this.$route.path !== '/userprofile')) {
                    window.localStorage.setItem("userProfileIndex", 0);
                    this.$router.push({
                        name: 'userprofile',
                    })
                }
          },

          handleLogout: function () {
            UserObject.logoutUser()
            .then(() => {
                localStorage.clear();
                this.$router.push({
                name: 'login',
                })
            })
            .catch(e => {
                localStorage.clear();
                    this.$router.push({
                    name: 'login',
                })
            })
          },
        // each time when the user goes to a different view of the website(when the navigation bar is reloaded), we check if there has been a new survey assigned to the tester,
        // and if there is a new survey, shows the notification dot
        checkForNewSurvey: async function() {
            let that = this;
                Surveys.getTesterSurveys(window.localStorage.getItem('userId'))
                .then(res => {
                    let res_data = res.data;
                    for(let i = 0; i < res_data.length; i++){
                        if(res_data[i]['checked'] == 1){
                            window.localStorage.setItem("newSurvey", 1)
                            break;
                        }
                    }
                })
                .catch(e => console.log(e));

        },
        updateColor: function() {
                var r = document.querySelector(':root');
                r.style.setProperty('--NAVTHEME', this.$store.state.navtheme);
                r.style.setProperty('--NAVCTN', this.$store.state.navctn);
                r.style.setProperty('--NAVEFFECT', this.$store.state.naveffect);
                r.style.setProperty('--TRIANGLE', this.$store.state.triangle);
                r.style.setProperty('--ACCOUNT', this.$store.state.account);
                r.style.setProperty('--LOGOUT', this.$store.state.account);
            },
        }
    }
</script>

<style scoped>
:root {
    --NAVTHEME: #fbfbfb;
    --NAVCTN: #fbfbfb;
    --NAVEFFECT:#fbfbfb;
    --TRIANGLE:#fbfbfb;
    --ACCOUNT:#fbfbfb;
    --LOGOUT:#fbfbfb;
}

.side-navbar-item{
    margin-top: 40%;
}

.side-navbar-text{
    margin-left: 5%;
    padding-left: 5%;
    border-radius: 15px;
    padding-right: 5%;
    margin-right: 25%;
}

.simulence-logo-sidebar{
    margin-left: 10%;
    margin-top: 5%;
}

#logo-img {
    height: auto;
    width: 70%;
    max-width: 100%;
}

.admin-item {
    margin-bottom: 3rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    margin-left: 10%;
}

.account-type-txt{
    cursor: pointer;
    margin-bottom: 0.5rem;
    display: flex;
}

.logout-txt{
    cursor: pointer;
    display: flex;
}

.sidebar-tag-text {
    color: white;
    padding-left: 1rem;
}

.side-navbar-text:hover{
    background-color: #4F4F4F;
}

.side-navbar {
    width: 250px !important;
    min-width: 250px !important;
    height: 100%;
    background: var(--NAVCTN);
    z-index: 100 !important;
}

.side-navbar-text > a {
    display: flex;
    align-items: center;
}
</style>

<style>
    .b-sidebar {
        width: 250px !important;
    }
</style>
