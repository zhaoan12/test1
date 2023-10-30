<template>
    <div class="nav-ctn">
        <div>
            {{updateColor()}}
        </div>
        <div v-if="newSurvey == 1" class="notification-dot">  </div>

        <b-navbar toggleable="lg" type="dark" class="nav-theme">
            <b-navbar-brand href="dashboard"><img src="../../assets/Simulence_logo.png" class="simulence-logo"></b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="navbar-item">
                    <b-nav-item class="navbar-text" v-for="(tag, index) in navTags2" :key="tag.name"
                    :style="{'color': (flag == index ? '#D25244' : '#E9E9EA'), 'border-bottom': (flag == index ? '2px solid #D25244' : '')}"
                    @click="changeTag(index)">
                        {{ tag.name }}
                    </b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav class="admin-item">
                    <div v-if="this.login" class="account-type" @click='goProfile'>
                        <div class="triangle"></div>
                        <div class="account-type-txt">{{ userType == 0 ? 'Player' : userType == 1 ? "Developer" : "Admin"}} Account</div>
                        <img v-if="this.login" :src="userAvatar" class="user-avator">
                        <div class="Logout-txt" @click="handleLogout">Log out</div>
                    </div>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
// NOTE: THIS IS THE OLD NAVBAR - SOME PAGES STILL USE THIS.
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
                        name: "DASHBOARD",
                        link: "dashboard",
                    }, {
                        name: "TEST",
                        link: "test",
                    }, {
                        name: "SURVEY",
                        link: "survey",
                    }, {
                        name: "CALENDAR",
                        link: "calendar",
                    }
                ],
                companyNavTags: [
                    {
                        name: "DASHBOARD",
                        link: "dashboard",
                    }, {
                        name: "TEST",
                        link: "test",
                    }, {
                        name: "SURVEY",
                        link: "survey",
                    }, {
                        name: "CALENDAR",
                        link: "calendar",
                    }
                ],
                adminNavTags: [
                    {
                        name: "DASHBOARD",
                        link: "dashboard",
                    }, {
                        name: "TEMPLATES",
                        link: "templates",
                    }, {
                        name: "USERS",
                        link: "users",
                    },
                    {
                        name: "SURVEYS",
                        link: "adminsurveys",
                    }, {
                        name: "CALENDAR",
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


.tag-lst {
    position: fixed;
    left: 313px;
    height: 65px;
    top: 0;
    display: flex;
}

.navbar-dark .navbar-nav .nav-link:active,
.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link:focus{
    color:var(--NAVEFFECT) !important
}

.navbar-dark .navbar-nav .nav-link {
    color: black !important;
}

.navbar-item {
    margin-left: 15rem;
}

.navbar-text {
    color: black;
}

.admin-item {
    margin-bottom: 3rem;
}

.tag-item {
    height: 64px;
    margin-right: 29px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 65px;
    text-align: center;
    align-items: center;
    color: #FC7727;
    cursor: pointer;
}

.tag-item:hover {
    color: #975952 !important;
    border-bottom: 2px solid #975952;
}

.underline {
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    bottom: 0;
    background: #E55342;
}

@media (max-width: 990px){

    .navbar-text {
        width: 8rem;
    }

    .admin-item {
       text-align: center;
    }
}

.user-avator {
    margin-top: 1rem;
    margin-left: 1rem;
    width: 33px;
    height: 33px;
    border-radius: 16.5px;
    top: 16px;
    right: 46px;
    cursor: pointer;
}

.account-type {
    position: absolute;
    bottom: 0px;
    right: 48px;
    display: flex;
    cursor: pointer;
}

.triangle {
    position: relative;
    width: 0;
    height: 0;
    top: 30px;
    margin-right: 10px;
    border-top: 5px solid var(--TRIANGLE);
    border-left: 3.5px solid transparent;
    border-right: 3.5px solid transparent;
}

.account-type-txt {
    position: relative;
    font-style: normal;
    font-weight: bold;
    font-size: 13px;
    line-height: 65px;
    display: flex;
    align-items: center;
    text-align: right;

    color: var(--ACCOUNT);
}

  .Logout-txt {
    position: relative;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 65px;
    display: flex;
    align-items: center;
    text-align: right;
    margin-left: 15px;
    color: var(--LOGOUT);
  }



</style>
<style>
.nav-ctn {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 65px;
    background: var(--NAVCTN);
    z-index: 100 !important;
}
:root {
    --NAVTHEME: #fbfbfb;
    --NAVCTN: #fbfbfb;
    --NAVEFFECT:#fbfbfb;
    --TRIANGLE:#fbfbfb;
    --ACCOUNT:#fbfbfb;
    --LOGOUT:#fbfbfb;
}


.nav-theme {
    background: var(--NAVTHEME);
}

.simulence-logo {
    width: 186.36px;
    height: 25px;
    position: absolute;
    top: 20px;
    left: 40px;
}
.navbar {
    padding-bottom: 0 !important;
}

.navbar-toggler {
    margin-right: 48px;
    margin-top: 13px;
}

.notification-dot {
    border-radius: 50%;
    background-color: red;
    width: 8px;
    height: 8px;
    position: absolute;
    z-index: 101;
    margin-left: 553px;
    margin-top: 23px;
}
</style>
