<template>
    <div class="recording-visual">
        <p class="white-text">RECORDINGS</p>

        <img src="../../assets/Not Found.png" class="noRecordingImage">
        <div class="noRecordingText">No recordings found (´；ω；`) </div>
    </div>
</template>

<script>
    export default {
        name: "gameDetailRecordings",
        props: {
            detail: {
                type: Object
            }
        },
        data() {
            // Return Game Detail Recording
            return {
                msg: "gameDetailRecordings",
                userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
            }
        },
        mounted() {
            // Get user type, if already logged in, set user type
            if (window.localStorage.getItem("userType")) {
                this.userType = parseInt(window.localStorage.getItem("userType"));
            // Else ask user to login
            } else {
                this.$router.push({
                    name: 'login',
                })
            }
        },
        methods: {
        },
    }
</script>

<style>

.white-text {
    color: #000000;
    font-size: large;
    font-family: Lato;
    text-align: center;
}
.recording-visual {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 86px;
    height: 102px;
    text-align: center;
}
.noRecordingText {
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
.noRecordingImage {
    margin-top: 250%;
    margin-right: 10%;
    width: 86px;
    height: 102px;
}
</style>
