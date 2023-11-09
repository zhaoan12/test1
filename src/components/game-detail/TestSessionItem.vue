<template>
    <div class="session-item">
        <div>
            {{updateColor()}}
        </div>
        <div class="dateInfo">
            <div class="session-date">{{ this.displayDate }}</div>
            <div class="session-time">{{ this.displayStartTime }} - {{ this.displayEndTime }}</div>

        </div>
        <div class="session-focus">{{ this.focus }}</div>
        <!-- <div class="text">{{ this.testerName }}</div>
        <div class="text">{{ this.developerName }}</div> -->
        <!-- <div v-if="userType === 0" class="join-test" @click="goToTest">Start Test</div> -->
        <div class="notes-button" @click="displayNotesModal">Notes</div>
        <!-- <div class="notes-button" v-b-modal.modal-1 >Notes</div> -->
    </div>
</template>

<script>
    export default {
        name: "testSessionItem",
        props: {
            id: {
                type: String
            },
            focus: {
                type: String
            },
            testerName: {
                type: String
            },
            developerName: {
                type: String
            },
            startDateTime: {
                type: Date
            },
            endDateTime: {
                type: Date
            },
            notes: {
                type: Array
            }
        },
        data() {
            return {
                userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
                displayEndTime: null,
                displayStartTime: null,
                displayDate: null,
            }
        },
        mounted() {
            this.userType = parseInt(window.localStorage.getItem("userType"));
            this.$nextTick(() => {
                this.displayDate = new Intl.DateTimeFormat('default', {dateStyle: 'medium'}).format(this.startDateTime)
                this.displayStartTime = new Intl.DateTimeFormat('default', {timeStyle: 'short'}).format(this.startDateTime)
                this.displayEndTime = new Intl.DateTimeFormat('default', {timeStyle: 'short'}).format(this.endDateTime)
            });
        },
        methods: {
             displayNotesModal: function() {
                this.$emit("openNotesModal", this.id);
            },

            updateColor: function() {
                var r = document.querySelector(':root');
                r.style.setProperty('--SESSION_ITEM_BORDER', this.$store.state.sessionItem_border);
                r.style.setProperty('--SESSION_ITEM_BACKGROUND', this.$store.state.sessionItem_background);
            },
        },
    }
</script>

<style>
:root {
    --SESSION_ITEM_BORDER: #fbfbfb;
    --SESSION_ITEM_BACKGROUND: #fbfbfb;
}


.dateInfo {
    width: 20%;
    text-align: center;
}
.session-date {
    font-size: 18px;
}
.session-item {
    width: 94%;
    height: 140px;
    margin-top: 38px;
    margin-right: 3%;
    border: 1px solid var(--SESSION_ITEM_BORDER);
    box-sizing: border-box;
    border-radius: 10px;
    background-color: var(--SESSION_ITEM_BACKGROUND);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}
.session-focus {
    text-align: center;
    width: 50%;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 15px;
    color: #E75B4B;
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
    color: #C4C2C2;
    cursor: pointer;
}
</style>