<template>
    <div id='login-page'>
        <div>
            {{updateColor()}}
        </div>
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>
        <div id='login-container'>
            <navigator />

            <div class='visibility-wrapper' v-show='!register'>
                <h1 class='login-title' id='login-as'>Login</h1>
                <form>
                    <input class='login-input' type="text" placeholder='Email address' v-model="loginEmail" /><br>
                    <input class='login-input' type="password" placeholder='Password' v-model="loginPwd" /><br>

                    <div id='login-button-area'>
                        <input class='login-button yellow-button-2' type='submit' value='LOGIN' @click.prevent='handleLogin'/>
                        <center class='white-text' id='register-msg'>No account?
                            <a class='textlink' @click='goRegister'>Register here</a>
                        </center>
                    </div>
                </form>
            </div>

            <div class='visibility-wrapper' v-show='register'>
                <h1 class='login-title' id='register-as'>Register as</h1>
                <form>
                    <center id='checkbox'>
                        <label class='checker white-text' @click="chooseTester">
                            <input type="radio" name="fav_language">
                            Tester
                        </label>
                        <label class='checker white-text' @click="chooseDeveloper">
                            <input type="radio" name="fav_language">
                            Developer
                        </label>
                    </center>

                    <input class='register-input' type="text" placeholder='Name' v-model="registerName" /><br>
                    <input class='register-input' type="text" placeholder='Email address' v-model="registerEmail" /><br>
                    <input class='register-input' type="password" placeholder='Password' v-model="registerPwd" /><br>
                    <input class='register-input' type="password" placeholder='Confirm password' v-model="registerCpwd" /><br>

                    <div id='register-button-area'>
                        <input class='cancel-button' type='submit' value='CANCEL' @click.prevent='goLogin'/>
                        <input class='register-button' type='submit' value='REGISTER' @click.prevent='handleRegister'/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import navigator from './NavBarOld.vue';
    import Surveys from "../../Firestore/Surveys"
    import Loading from '../loading/index.vue';

    import {mapGetters} from 'vuex';
    import UserObject from "../../Firestore/UserObject";

    export default {
        name: "login",
        components: {
            navigator,
            Loading
        },
        data() {
            return {
                isLoading: false,
                msg: "login now",
                register: false,
                loginInfo: {
                    email: 1,
                    password: 1
                },
                registerInfo: {
                    userName: 1,
                    email: 1,
                    password: 1,
                    confirmPassword: 1
                },
                loginEmail: "",
                loginPwd: "",
                registerName: "",
                registerEmail: "",
                registerPwd: "",
                registerCpwd: "",
                registerUserType: "",
                defaultAvatar: require("../../assets/avatar_default.png"),
            }
        },
        mounted() {
            if (window.localStorage.getItem("userType")) {
                this.$router.push({
                    name: 'dashboard',
                })
            }
            UserObject.logoutUser()
            .then(() => {
                localStorage.clear();
            })
            .catch(e => {
                localStorage.clear();
            })
        },
        methods: {
            chooseTester: function() {
                this.registerUserType = "tester"
            },

            chooseDeveloper: function() {
                this.registerUserType = "developer"
            },

            changeInput: function() {},

            goRegister: function() {
                this.register = true;
            },

            goLogin: function() {
                this.register = false;
            },

            handleLogin: function() {
                let that = this;
                if (this.loginEmail.length == 0) {
                    alert("Please enter your email");
                    return;
                }
                if (this.loginPwd.length == 0) {
                    alert("Please enter your password");
                    return;
                }
                this.isLoading = true;

                UserObject.loginUser({
                    email: this.loginEmail,
                    password: this.loginPwd
                })
                .then(res => {
                    let numType=-1;
                    // determine user type via response
                    if (res.data.userType==="tester") {
                        numType=0;
                    } else if (res.data.userType==="developer") {
                        numType=1;
                    } else {
                        numType=2;
                    }
                    window.localStorage.setItem("userType", numType);
                    window.localStorage.setItem("userId", res.data.id);
                    window.localStorage.setItem("userEmail", res.data.email);
                    window.localStorage.setItem("userAvatar", res.data.img);
                    if (res.data.userType==="tester") {
                        Surveys.getTesterSurveys(res.data.id)
                        .then(res2 => {
                            // check all surveys for tester and indicate to user if any are new
                            for (let i = 0; i < res.data.length; i++) {
                                const survey = res.data[i];
                                if (survey.checked === 1) {
                                    window.localStorage.setItem("newSurvey", 1);
                                    break;
                                }
                            }
                        })
                        .catch(e => console.log(e));
                    }
                    this.$router.push({
                        name: 'dashboard',
                        params: {
                            tag: 0
                        }
                    });
                    that.isLoading = false;
                })
                .catch(e => {
                    alert(e.error);
                    that.isLoading = false;
                });
            },

            handleRegister: function() {
                let that = this;
                let correct = true;
                if (this.registerName.length == 0) {
                    alert("Please enter your name");
                    correct = false;
                }
                if (correct && this.registerUserType.length == 0) {
                    alert("Please choose your user type");
                    correct = false;
                }
                if (correct && this.registerEmail.length == 0) {
                    alert("Please enter your email");
                    correct = false;
                }
                if (correct && this.registerPwd.length == 0) {
                    alert("Please enter your password");
                    correct = false;
                }
                if (correct && this.registerCpwd != this.registerPwd) {
                    alert("Confirmed password does not match your password");
                    correct = false;
                }
                if (correct) {
                    this.isLoading = true;
                    UserObject.registerUser({
                        name: this.registerName,
                        userType: this.registerUserType,
                        email: this.registerEmail,
                        password: this.registerPwd,
                        img: this.defaultAvatar,
                    })
                    .then(res => {
                        let numType=-1;
                        if (res.data.userType==="tester") {
                            numType=0;
                        } else if (res.data.userType==="developer") {
                            numType=1;
                        } else {
                            numType=2;
                        }
                        window.localStorage.setItem("userType", numType);
                        that.isLoading = false;
                        that.goLogin();
                    })
                    .catch(e => { // request failure handler
                        console.log(e);
                        that.isLoading = false;
                    });
                } else {
                    this.goRegister();
                }
            },

            handleCancel: function() {},

            updateColor: function() {
                var r = document.querySelector(':root');
                r.style.setProperty('--BOTTONCOLOR', this.$store.state.logincolor);
                r.style.setProperty('--CONTRABOTTONCOLOR', this.$store.state.cancelbcolor);
                r.style.setProperty('--TEXTCOLOR', this.$store.state.textcolor);
                r.style.setProperty('--PROMPTCOLOR', this.$store.state.promptcolor);
                r.style.setProperty('--PROMPTBKCOLOR', this.$store.state.promptbkcolor);
                r.style.setProperty('--LOGINPAGE', this.$store.state.loginpage);
                r.style.setProperty('--LOGINCONTAINER', this.$store.state.logincontainer);
                r.style.setProperty('--LOGINTITLE', this.$store.state.logintitle);
            },
        }
    }
</script>

<style>
:root {
  --BOTTONCOLOR: #fbfbfb;
  --CONTRABOTTONCOLOR: #fbfbfb;
  --TEXTCOLOR: #fbfbfb;
  --PROMPTCOLOR: #fbfbfb;
  --PROMPTBKCOLOR: #fbfbfb;
  --LOGINPAGE: #fbfbfb;
  --LOGINCONTAINER: #965d5d;
  --LOGINTITLE:#643232;
}

#login-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--LOGINPAGE);
}

#login-container {
    position: relative;
    width: 700px;
    height: 470px;
    margin: auto;
    margin-top: 160px;
    background: var(--LOGINCONTAINER);
    border: 2px solid var(--LOGINCONTAINER);
    box-sizing: border-box;
    border-radius: 15px;
}

.login-title {
    position: relative;
    width: 70%;
    height: 37px;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: -0.015em;
    color: var(--LOGINTITLE);
}

#login-as{
    margin-top: 65px;
    margin-bottom: 35px;
    margin-left: 15%;
}

#register-as {
    margin-top: 35px;
    margin-left: 15%;
}

#checkbox {
    position: relative;
    margin: auto;
    width: 70%;
    margin-top: 30px;
}

.checker {
    margin-left: 4%;
    margin-right: 4%;
    cursor: pointer;
}

.login-input {
    position: relative;
    width: 70%;
    height: 40px;
    margin-left: 15%;
    margin-top: 30px;
    background: var(--PROMPTBKCOLOR);
    border: 1px solid var(--PROMPTCOLOR);
    box-sizing: border-box;
    border-radius: 5px;
}

.register-input {
    position: relative;
    width: 70%;
    height: 40px;
    margin-left: 15%;
    margin-top: 20px;
    background: var(--PROMPTBKCOLOR);
    border: 1px solid var(--PROMPTCOLOR);
    box-sizing: border-box;
    border-radius: 5px;
}

#login-button-area {
    position: relative;
    width: 70%;
    margin-left: 15%;
    margin-top: 50px;
}

#register-button-area {
    position: relative;
    width: 70%;
    margin-left: 15%;
    margin-top: 20px;
}

.login-button {
    position: relative;
    width: 45%;
    height: 40px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 27%;
    background: var(--BOTTONCOLOR);
}

.cancel-button {
    position: absolute;
    left: -20px;
    top: 0px;
    width: 45%;
    height: 40px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 9%;
    background: var(--CONTRABOTTONCOLOR)
}

.register-button {
    position: absolute;
    left: -40px;
    top: 0px;
    width: 45%;
    height: 40px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 60%;
    background: var(--BOTTONCOLOR);
}

#register-msg {
    position: relative;
    margin-top: 20px;
}

.textlink {
    text-decoration: underline;
    color: var(--BOTTONCOLOR);
    cursor: pointer
}

.white-text {
    color: var(--TEXTCOLOR);
}
</style>
