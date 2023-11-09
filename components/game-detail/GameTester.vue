<template>
    <div class="game-tester">
        <div>
            {{updateColor()}}
        </div>
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>

        <div id="tester-info">
            <img id="tester-avatar" :src="this.userProfile.img">
            <div id="tester-name">{{ this.userProfile.userName }}</div>
            <div id="tester-email">{{ this.userProfile.email }}</div>
            <div id="view-time-slot" v-show="!timeslot" @click.prevent="handleViewTimeSlot">
                <div id="view-time-text">View Time Slot</div>
                <img id="view-time-arrow" src="../../assets/down.png" />
            </div>
            <div id="hide-time-slot" v-show="timeslot" @click.prevent="handleHideTimeSlot">
                <div id="view-time-text">Hide Time Slot</div>
                <img id="hide-time-arrow" src="../../assets/up.png" />
            </div>
        </div>

        <div v-show="timeslot" id="time-slot-list">
            <img id="time-slot-splitter" src="../../assets/splitter.png" />
            <div class="one-slot" v-for="oneSlot in userProfile.timeSlotList" :key="oneSlot">{{ 'From &nbsp &nbsp' + oneSlot[0].replace("T", " &nbsp") + '&nbsp &nbsp to &nbsp &nbsp' + oneSlot[1].replace("T", " &nbsp") }}</div>
            <div id="edit-time-slot" @click.prevent="handleEditTimeSlot">Edit</div>
        </div>

        <div class="view-response" v-show="!response">No Response Yet</div>
        <div class="view-response" v-show="response" @click.prevent="handleGoResponse">View Response</div>
        <div id="remove-tester" @click.prevent="handleRemoveTester">Remove</div>
    </div>
</template>

<script>
    import Firestore from '../../Firestore'
    import Loading from '../loading/index.vue'
    import UserObject from "../../Firestore/UserObject";
    import GameTesting from "../../Firestore/GameTesting";
    export default {
        name: "gameTester",
        components: {
            Loading
        },
        props: {
            id: {
                type: String
            }
        },
        data() {
            return {
                userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
                msg: "game tester",
                timeslot: false,
                response: true,
                isLoading: false,
                userProfile: {
                    userName: "",
                    email: "",
                    img: "",
                    timeSlotList: []
                },
            }
        },
        mounted() {
            this.userType = parseInt(window.localStorage.getItem("userType"));
            this.isLoading = true;
            let that=this;
            UserObject.getProfile(this.id)
            .then(res => {

                let res_data = res.data;
                that.$data.userProfile.userName = res_data.userName;
                that.$data.userProfile.email = res_data.email;
                that.$data.userProfile.img = res_data.img;

                that.$data.isLoading = false;
            })
            .catch(function (error) { // request failure handler
                console.log(error);
                that.$data.isLoading = false;
            });

            this.isLoading = true;
            GameTesting.getTimeSlot(
                window.localStorage.getItem("gameId"),
                this.id
            )
            .then(res => {
                let res_data = res.data;
                this.userProfile.timeSlotList = res_data.timeSlotList;
                that.$data.isLoading = false;
            })
            .catch(function (error) { // request failure handler
                console.log(error);
                that.$data.isLoading = false;
            });
        },
        methods: {
            handleGoResponse: function() {
                this.$emit('goResponse', this.id);
            },

            handleViewTimeSlot: function() {
                this.timeslot = true;
            },

            handleHideTimeSlot: function() {
                this.timeslot = false;
            },

            handleEditTimeSlot: function() {
                this.$emit('editTimeSlot', this.id, this.userProfile.timeSlotList);
            },

            handleRemoveTester: function() {
                this.$emit('removeTester', this.id);
            },
            updateColor: function() {
                var r = document.querySelector(':root');
                r.style.setProperty('--GAMETESTERB', this.$store.state.gametesterb);
                r.style.setProperty('--VIEWRES', this.$store.state.viewres);
            },
        },
    }
</script>

<style>
:root {
    --GAMETESTERB: #fbfbfb;
    --VIEWRES: #fbfbfb;
}
.game-tester {
    position: relative;
    width: 100%;
    min-height: 100px;
    margin-bottom: 40px;
    padding-left: 5%;
    padding-right: 5%;
    padding-bottom: 3%;
    border: 1px solid rgba(225, 255, 255, 0.35);
    box-sizing: border-box;
    border-radius: 10px;
    page-break-inside: avoid;
    break-inside: avoid-column;
    background-color: #fbfbfb;
}

#tester-avatar {
    position: absolute;
    top: 23.5px;
    left: 0;
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

#tester-name {
    position: absolute;
    top: 23px;
    left: 70px;
    margin-left: 5%;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    color: #FC7727;
}

#tester-email {
    position: absolute;
    top: 44px;
    left: 70px;
    margin-left: 5%;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 13px;
    color: #464444;
}

#view-time-slot {
    position: absolute;
    top: 80px;
    left: 70px;
    width: 50%;
    margin-left: 5%;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 13px;
    color: #2b2a2a;
    cursor: pointer;
}

#hide-time-slot {
    position: absolute;
    top: 80px;
    left: 70px;
    width: 50%;
    margin-left: 5%;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 13px;
    color: #2b2a2a;
    cursor: pointer;
}

#view-time-text {
    margin-right: 2%;
    display: inline-block;
    vertical-align: middle;
}

#view-time-arrow {
    width: 10px;
    display: inline-block;
    vertical-align: middle;
}

#hide-time-text {
    margin-right: 2%;
    display: inline-block;
    vertical-align: middle;
}

#hide-time-arrow {
    width: 10px;
    display: inline-block;
    vertical-align: middle;
}

#tester-info {
    position: relative;
    height: 100px;
}

#time-slot-list {
    position: relative;
    width: 100%;
    margin-bottom: 15px;
}

#time-slot-splitter {
    width: 100%;
}

.one-slot {
    width: 95%;
    margin-left: 2%;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #C4C2C2;
}

.view-response {
    position: absolute;
    width: 30%;
    height: 28px;
    right: 5%;
    top: 65px;
    background: #FC7727;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 5px;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;

    text-align: center;
    color: var(--VIEWRES);
    cursor: pointer;
}

.view-response:hover {
    background: #eb9661;
}

#remove-tester {
    position: absolute;
    top: 20px;
    right: 5%;
    font-size: 11px;
    line-height: 13px;
    text-decoration: underline;
    color: #E55342;
    cursor: pointer
}

#remove-tester:hover {
    color: #f07567;
}

#edit-time-slot {
    position: absolute;
    bottom: -15px;
    right: 0;
    font-size: 11px;
    line-height: 13px;
    text-decoration: underline;
    color: #E39E4D;
    cursor: pointer
}
</style>
