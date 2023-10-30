<template>
    <div class="d-flex">
        <navigator class="navigator" :flag="navFlag" />
        <div class="test-page">
            <div class="title-header">
                <h1> Testing Sessions </h1>
            </div>

            <div class="view" v-if="userType === 0">
                <div v-if="!this.projectID" class="nostream">
                    <h5 class="noTest">NO ACTIVE TESTING SESSIONS</h5>
                    <h6>Please navigate to <router-link to="/">Dashboard</router-link> and select a project to start a Test
                        Session</h6>
                </div>

                <div v-if="!this.projectID" class="noTestVisual">
                    <img src="../../assets/Not Found.png" class="noTestImage">
                    <div class="noTestText">No tests found (´；ω；`) </div>
                </div>

                <div v-if="this.projectID" class="testerContainer">
                    <div id="testerVideoContainer">
                        <div id="testerVideoDisplay"></div>
                    </div>
                    <div class="notes-button red" @click="endStream">End Test</div>

                </div>
            </div>
            <div class="view" v-if="userType === 1">
                <div v-if="!projectID || projectID === ''" class="nostream">
                    <h5 class="noTest">NO ACTIVE TESTING SESSIONS</h5>
                    <h6>Please navigate to <router-link to="/">Dashboard</router-link> and select a project that has an
                        active
                        Test Session</h6>
                </div>

                <div v-if="!this.projectID" class="noTestVisual">
                    <img src="../../assets/Not Found.png" class="noTestImage">
                    <div class="noTestText">No tests found (´；ω；`) </div>
                </div>
                <div v-if="this.projectID" class="developerContainer">
                    <div id="developerVideoContainer">
                        <div v-if="!this.activeStream" class="nostream">
                            <h1>Test Session Complete</h1>
                            <h5>Please submit any final notes and then leave the session.</h5>
                        </div>
                        <div id="developerVideoDisplay"></div>
                        <div class="notes-button red" @click="leaveStream">Leave</div>
                    </div>

                    <noteEntry v-if="this.sessionID" :testFocus="this.testFocus" :notes="this.notes"
                        @saveNote="this.saveNote" @saveFocus="this.updateFocus"></noteEntry>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import navigator from '../layout/NavBarNew.vue'
import noteEntry from './NoteEntryComponent.vue'
import RTCMultiConnection from 'rtcmulticonnection'
import router from '../../router';
import GameTesting from "../../Firestore/GameTesting";
export default {
    name: "test",
    components: {
        navigator,
        router,
        noteEntry
    },
    data() {
        return {
            navFlag: 1,
            userType: window.localStorage.getItem("userType") ? window.localStorage.getItem("userType") : -1,  // 0: Tester, 1: Company, 2: Admin
            activeStream: true,
            sessionID: this.$route.params.sessionID || null,
            projectID: this.$route.params.projectID || "",
            connection: null,
            notes: [],
            testFocus: "",
            ready: true,
        }
    },
    beforeRouteLeave(to, from, next) {
        // ask user to confirm that they want to route away from the active test
        if (this.sessionID && this.userType === 0) {
            if (!window.confirm("Leave without saving?")) {
                return;
            }
            if (this.userType === 0) this.endStream();
        }
        next();
    },
    mounted() {
        // add socket url to top of html
        let socket_io = document.createElement('script')
        socket_io.setAttribute('src', 'https://cdn.socket.io/4.5.4/socket.io.min.js')
        document.head.appendChild(socket_io)


        if (window.localStorage.getItem("userType")) {
            this.userType = parseInt(window.localStorage.getItem("userType"));

            // setup streaming connection
            this.connection = new RTCMultiConnection();
            this.connection.socketURL = 'https://muazkhan.com:9001/';

            this.connection.socketMessageEvent = 'test-session';

            // set video sharing attributes for the connection
            this.connection.session = {
                audio: true,
                screen: true,
                oneway: true
            };

            this.connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: false,
                OfferToReceiveVideo: false
            };

            // set data values when page loads fully
            this.$nextTick(function () {
                this.sessionID = this.$route.params.sessionID || null;
                this.projectID = this.$route.params.projectID || "";

                // choose which html element will contain the video stream
                if (this.userType === 0) this.connection.videosContainer = document.getElementById("testerVideoDisplay");
                else if (this.userType === 1) this.connection.videosContainer = document.getElementById("developerVideoDisplay");
            });

            // start stream validation if we have a projectID from route parameters (e.g. only if user initiated/joined the stream, not clicked on Test page)
            if (this.projectID) {
                this.validateSession();
                this.getNotes();
            }
            let that = this;
            this.connection.onMediaError = function (error, constraints) {
                // if reached here, the user didn't share their screen. Need to end the stream
                that.endStream();
            };

            // perform video teardown when the stream ends
            this.connection.onstreamended = function (event) {
                var mediaElement = document.getElementsByTagName('video')[0];
                if (mediaElement) {
                    mediaElement.parentNode.removeChild(mediaElement);
                }
                that.$set(that.$data, 'activeStream', false);

            };
        } else {
            this.$router.push({
                name: 'login',
            })
        }
    },
    methods: {
        endStream() { // tester
            // on stream end, update session document, cleanup stream-related data and send tester back to the dashboard
            GameTesting.testerEndTestSession(this.sessionID)
                .then(res => {
                    this.activeStream = false;
                    this.$set(this.$data, 'sessionID', null);
                    this.$router.push({
                        name: 'dashboard',
                    }).then(() => this.$router.go());

                })
                .catch(e => console.log(e));

        },
        leaveStream() { // developer
            this.$set(this.$data, 'sessionID', null);
            if (this.activeStream) {
                // navigate to dashboard if leaving active stream
                this.activeStream = false;
                this.$router.push({
                    name: 'dashboard'
                }).then(() => this.$router.go());
            } else {
                // navigate to gamedetails page with current game selected if leaving a completed stream
                this.activeStream = false;
                localStorage.setItem('gameId', this.projectID);
                window.localStorage.setItem("gameDetailIndex", 1);
                this.$router.push({
                    name: 'gamedetail',
                }).then(() => this.$router.go());
            }
        },

        handleTesterDisplay(e) {
            console.log(e);
            console.log(e.innerHTML);
        },
        // start the stream from the tester side.
        // user to share their display video, computer audio and mic audio
        // user display video to show on screen
        startStream() {
            console.log("Starting Stream...");
            console.log(this.sessionID);
            this.activeStream = true;
            this.connection.open(this.sessionID, () => console.log("started!"));
        },
        // goal: to confirm that the sessionID is valid, and the associated session is for a project assigned
        // to the current user (either tester or developer). The success of this function will begin the stream
        // input: sessionID (string)

        // call GameTesting.getTestSession(sessionID) which returns the session data on success, or error on failure
        // if successful:

        // check if developer(s) for project of session include the logged in developer. If so, call startStream()

        // if error: display error
        validateSession() {
            if (this.userType === 0) { // tester
                GameTesting.checkGameHasActiveTestSession(this.projectID, window.localStorage.getItem("userId"))
                    .then((res) => {
                        if (!res.data.activeSession) {
                            // 1. create new test session
                            GameTesting.createTestSession(window.localStorage.getItem("userId"), this.projectID)
                                .then(res => {
                                    const newSessionID = res.data;

                                    // 2. start newly created test session
                                    GameTesting.testerStartTestSession(newSessionID)
                                        .then(res => {
                                            // 3. start streaming!
                                            this.$set(this.$data, 'sessionID', newSessionID);
                                            this.startStream();
                                        })
                                        .catch(e => console.log(e));
                                })
                                .catch(e => console.log(e));

                        } else {
                            console.log("has active session!");
                        }
                    })
                    .catch(e => console.log(e));
            } else if (this.userType === 1) { // developer
                GameTesting.checkGameHasActiveTestSession(this.projectID, null)
                    .then((res) => {
                        if (res.success && res.data.activeSession) {
                            // 1. join test session
                            GameTesting.joinTestSession(res.data.session.sessionID, window.localStorage.getItem("userId"))
                                .then(res2 => {
                                    // set test session/stream values
                                    const newSessionID = res.data.session.sessionID;
                                    this.$set(this.$data, 'testFocus', res.data.session.testFocus);
                                    this.notes = res.data.session.notes;

                                    this.$set(this.$data, 'sessionID', newSessionID);

                                    this.joinStream();
                                })
                                .catch(e => console.log("joinTestSession error: ", e));

                        } else {
                            console.log("no active sessions");
                        }

                    })
                    .catch(e => console.log("checkGameHasActiveTestSession error: ", e));
            }
        },
        joinStream() {
            this.activeStream = true;
            this.connection.join(this.sessionID);
        },
        getNotes() {
            GameTesting.getTestSessionNotes(this.sessionID)
                .then(res => {
                    this.notes = res.data;
                })
                .catch(e => console.log(e));
        },
        getFocus() {
            GameTesting.getTestSessionFocus(this.sessionID)
                .then(res => {
                    this.testFocus = res.data;
                })
                .catch(e => console.log(e));
        },
        updateFocus(newFocus) {
            GameTesting.updateTestSessionFocus(this.sessionID, newFocus)
                .then(res => {
                    this.$set(this.$data, 'testFocus', newFocus);
                })
                .catch(e => console.log(e));
        },
        saveNote(note) {
            GameTesting.addSessionNote(this.sessionID, note)
                .then(res => {
                    this.getNotes();
                })
                .catch(e => console.log(e));
        },
    },
    watch: {
        // used to detect when sessionID has changed, and to update the stream status (this.activeStream) accordingly
        sessionID(newVal, oldVal) {
            if (oldVal !== null && newVal === null) {
                this.activeStream = false;
            } else if (oldVal === null && newVal !== null) {
                this.activeStream = true;
            }
        },
    },
}
</script>

<style>
.test-page {
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
  height: 90px;
  width: 100%;
}

.title-header h1 {
  color: #FF7222;
  font-weight: bold;
}
.view {
    margin-top: 85px;
}

#testerVideoDisplay {
    overflow: scroll;
}

#developerVideoDisplay {
    overflow: scroll;
}

video {
    border: 1px solid green;
    height: 500px;
}

.developerContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.testerContainer {
    width: 100%;
    text-align: center;
}

#testerVideoContainer {
    width: 100%;
    overflow: scroll;
    text-align: center;
}

#developerVideoContainer {
    width: 80%;
    max-width: 1080px;
    text-align: center;
}

.nostream {
    text-align: left;
    position: relative;
    /* top: 0px; 116? */
    /* left: 0px; 46? This was made with absolute */
    margin-left: 46px;
    font-family: Lato;
    font-style: normal;
    font-size: 16px;
    line-height: 15px;
    color: #000000;
}

.noTest {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 15px;
    color: #FC7727;
}

.noTestVisual {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;
    margin-top: 10%;
}

.noTestImage {
    width: 10%;
}

.noTestText {
    width: 209px;
    height: 18px;
    margin-left: -67px;
    margin-top: 9px;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
    color: #C4C2C2;
}

.notes-button {
    width: 93.08px;
    height: 28px;
    background: #666464;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 5px;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;
    text-align: center;
    color: black;
    cursor: pointer;
}

.red {
    background: red;
}
</style>
