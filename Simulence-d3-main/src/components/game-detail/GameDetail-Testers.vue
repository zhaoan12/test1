<template>
    <div id="game-detail-testers">
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>

        <div v-if="current == 0">
            <div id="title-wrapper">
                <gameTitle :id="detail.gameName" :title="detail.gameName" :img="detail.img" :company="detail.company"
                    :endTime="detail.endTime" />
            </div>
            <b-button class="add-new-tester" v-on:click="addTester()">
                Add New Tester
            </b-button>
            <div id="tester-list">
                <gameTester v-for="testerId in latestTesterIDs" :key="testerId" :id="testerId"
                    @goResponse="handleGoResponse" @editTimeSlot="handleEditTimeSlot" @removeTester="handleRemoveTester" />
            </div>
        </div>

        <div v-if="current == 1" id="game-detail-testers-response">
            <div class="addtester-back" @click="toDetailTest">← Go Back To Tester List</div>
            <gameTitle :id="detail.gameName" :title="detail.gameName" :img="detail.img" :company="detail.company"
                :endTime="detail.endTime" />

            <div v-if="responseList.length > 0" class="row">
                <div class="col-12 mt-2">
                    <div class="row my-3">
                        <div class="col-12">
                            <b-button variant="transparent" class="mr-2 all" @click="openAll">Open all</b-button>
                            <b-button variant="transparent" class="all" @click="closeAll">Close all</b-button>
                        </div>
                    </div>

                    <div class="row mb-4" v-for="(collapse, index) in collapses" :key="index">
                        <div class="col-12">
                            <b-button @click="collapse.show = !collapse.show"
                                v-bind:class="{ 'active-style': collapse.show, 'hidden-style': !collapse.show }"
                                variant="transparent" class="response-title">
                                <b-icon icon="arrow-right" v-if="!collapse.show" aria-hidden="true"></b-icon>
                                <b-icon icon="arrow-down" v-if="collapse.show" aria-hidden="true"></b-icon>
                                Response {{ index + 1 }}
                            </b-button>
                            <b-collapse v-model="collapse.show" id="collapse-1" class="mt-2">
                                <b-card class="response-detail">
                                    <div class="response-text" v-for="(entry, j) in responseList[index].questions" :key="j">
                                        <p class="card-text white-text">Question: {{ entry }}</p>
                                        <p class="card-text white-text">Answer: {{ responseList[index].answers[j] }}</p>
                                    </div>
                                </b-card>
                            </b-collapse>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="responseList.length == 0" class="no-response">
                <img src="../../assets/Not Found.png" class="no-response-img">
                <div class="no-response-txt">This tester has no response (´；ω；`)</div>
            </div>
        </div>

        <div v-if="current == 2" id="game-detail-testers-add">
            <div class="addtester-back" @click="toDetailTest">← Go Back To Tester List</div>

            <div class="class filtering-testers">
                <b-button v-b-toggle.collapse-1 class="ml-1">
                    Advanced Search
                </b-button>
                <b-button @click="handleClear" v-if="selectedFieldValues.length">
                    Clear
                </b-button>
                <b-button class="mr-1" @click="refreshAddTesterList">
                    Search
                </b-button>
                <b-button v-for="(selectedFieldValue, index) in selectedFieldValues" :key="index" :id="index" class="m-1"
                    v-bind:variant="selectedFieldValue.variant"
                    @click="handleSelectedFieldValue(selectedFieldValue.fieldValue, selectedFieldValue.field_index)">
                    {{ selectedFieldValue.fieldValue }}
                </b-button>
                <b-collapse id="collapse-1" class="m-2">
                    <b-button-group>
                        <b-button v-for="(fieldObject, field_index) in testerFields" :key="fieldObject.field_index"
                            :id="fieldObject.field_index" v-b-toggle="'collapse-1-inner' + field_index" size="sm"
                            v-bind:variant="variantsList[field_index % variantsList.length]" square>
                            {{ fieldObject.fieldName }}
                        </b-button>
                    </b-button-group>

                    <b-collapse v-for="(fieldObject, field_index) in testerFields" :key="fieldObject.field_index" inline
                        v-bind:id="'collapse-1-inner' + field_index" accordion="field-value-accordion">

                        <b-button v-for="(fieldValue, value_index) in returnNotAddedValues(fieldObject.fieldValues)"
                            :key="value_index" :id="value_index" size="sm" class="mt-2 p-1 mx-1"
                            @click="handleFieldValue(fieldValue.value, field_index)">
                            {{ fieldValue.value }}
                        </b-button>

                    </b-collapse>

                </b-collapse>
            </div>

            <div class="game-detail-tester-lst-ctn">

                <addTesterItem v-for="(addItem, idx) in addTesterList" :key="addItem.id" :id="addItem.id"
                    :name="addItem.name" :email="addItem.email" :hasBorder="idx != addTesterList.length - 1"
                    :gameId="gameId" @addTester="handleAddTester" />
                <!-- add img -->
                <div v-if="!addIsLast && addTesterList.length != 0" class="show-more" @click="addNextPage">SHOW MORE</div>
                <div v-if="addTesterList.length == 0" class="add-tester-no-tester">
                    <img src="../../assets/Not Found.png" class="add-tester-no-tester-img">
                    <div class="add-tester-no-tester-txt">No tester available (´；ω；`)</div>
                </div>
            </div>
        </div>

        <div v-if="current == 3" id="game-detail-testers-assign">
            <div class="addtester-back" @click="toDetailTest">← Go Back To Tester List</div>
            <gameTitle :id="detail.gameName" :title="detail.gameName" :img="detail.img" :company="detail.company"
                :endTime="detail.endTime" />

            <!-- add image -->
            <div class="game-detail-testers-add-title">TESTER</div>
            <addTesterItem :key="assignTesterId" :id="assignTesterId" :name="assigntesterInfo.userName"
                :email="assigntesterInfo.email" :hasBorder=false :gameId="gameId" :hasButton=false
                @addTester="handleAddTester" />

            <div class="game-detail-testers-add-title">ASSIGNED TIME SLOTS</div>
            <div class="one-slot" v-for="oneSlot in assigntesterTimeSlotList" :key="oneSlot">{{ 'From &nbsp &nbsp' +
                oneSlot[0].replace("T", " &nbsp") + '&nbsp &nbsp to &nbsp &nbsp' + oneSlot[1].replace("T", " &nbsp") }}
            </div>

            <div class="game-detail-testers-add-title">ADD NEW TIME SLOT</div>
            <div class="game-detail-assign-ctn">
                <div class="game-detail-assign-date-item">
                    Year:
                    <select class="game-detail-assign-selection-box" @change="handleSelect('year', $event)">
                        <option v-for="(year, idx) in assignYearSelection" :key="year.yearText">{{ year.yearText }}</option>
                    </select>
                </div>
                <div class="game-detail-assign-date-item">
                    Month:
                    <select class="game-detail-assign-selection-box" @change="handleSelect('month', $event)">
                        <option v-for="(month, idx) in assignMonthSelection" :key="month.monthText">{{ month.monthText }}
                        </option>
                    </select>
                </div>
                <div class="game-detail-assign-date-item">
                    Day:
                    <select class="game-detail-assign-selection-box" @change="handleSelect('day', $event)">
                        <option v-for="(day, idx) in assignDaySelection" :key="day.dayText">{{ day.dayText }}</option>
                    </select>
                </div>
                <div class="game-detail-assign-date-item">
                    Hour:
                    <select class="game-detail-assign-selection-box" @change="handleSelect('hour', $event)">
                        <option v-for="(hour, idx) in assignHourSelection" :key="hour.timeText">{{ hour.timeText }}</option>
                    </select>
                </div>
                <div class="game-detail-assign-btn" @click.prevent="handleAdd">Add</div>
            </div>
        </div>
    </div>
</template>

<script>
import Firestore from '../../Firestore'
import gameTester from './GameTester.vue';
import gameTitle from './GameTitle.vue';
import addTesterItem from './AddTesterItem.vue';
import Loading from '../loading/index.vue'
import UserObject from "../../Firestore/UserObject";
import GamesObject from "../../Firestore/GamesObject";
import FilteringTesters from "../../Firestore/FilteringTesters";
import GameTesting from "../../Firestore/GameTesting";

const today = new Date();
export default {
    name: "gameDetailTesters",
    components: {
        gameTester,
        gameTitle,
        addTesterItem,
        Loading
    },
    props: {
        detail: {
            type: Object
        }
    },
    data() {
        return {
            selectedFieldValues: [], // play tester fields that are selected
            variantsList: [], // list of variants to group field values by their field
            testerFields: [], // play tester fields that can be selected in the filter
            msg: "gameDetailTesters",
            userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
            gameId: window.localStorage.getItem("gameId"),
            isLoading: false,
            current: 0,   // 0: Game Detail-tester, 1: tester response, 2: add tester, 3: assign time slot
            latestTesterIDs: [], // testers added to this game
            addTesterList: [], // testers not added to latestTesterIDs
            addPageNum: 1, // the number of pages
            addPageSize: 6, // maximum number of testers in a single page
            addIsLast: false, // true if there can't be more pages added
            addTotalPage: 1, // the maximum number of pages based on the maximum size of addTesterList
            assignTesterId: "",
            assigntesterInfo: {},
            assigntesterTimeSlotList: [],
            assignYearSelected: "",
            assignMonthSelected: "",
            assignDaySelected: "",
            assignHourSelected: 0,
            assignYearSelection: [],
            assignDaySelection: [],
            assignHourSelection: [
                {
                    timeText: "0:00 AM - 1:00 AM",
                    startTimeString: "00:00:00",
                    endTimeString: "01:00:00"
                }, {
                    timeText: "1:00 AM - 2:00 AM",
                    startTimeString: "01:00:00",
                    endTimeString: "02:00:00"
                }, {
                    timeText: "2:00 AM - 3:00 AM",
                    startTimeString: "02:00:00",
                    endTimeString: "03:00:00"
                }, {
                    timeText: "3:00 AM - 4:00 AM",
                    startTimeString: "03:00:00",
                    endTimeString: "04:00:00"
                }, {
                    timeText: "4:00 AM - 5:00 AM",
                    startTimeString: "04:00:00",
                    endTimeString: "05:00:00"
                }, {
                    timeText: "5:00 AM - 6:00 AM",
                    startTimeString: "05:00:00",
                    endTimeString: "06:00:00"
                }, {
                    timeText: "6:00 AM - 7:00 AM",
                    startTimeString: "06:00:00",
                    endTimeString: "07:00:00"
                }, {
                    timeText: "7:00 AM - 8:00 AM",
                    startTimeString: "07:00:00",
                    endTimeString: "08:00:00"
                }, {
                    timeText: "8:00 AM - 9:00 AM",
                    startTimeString: "08:00:00",
                    endTimeString: "09:00:00"
                }, {
                    timeText: "9:00 AM - 10:00 AM",
                    startTimeString: "09:00:00",
                    endTimeString: "10:00:00"
                }, {
                    timeText: "10:00 AM - 11:00 AM",
                    startTimeString: "10:00:00",
                    endTimeString: "11:00:00"
                }, {
                    timeText: "11:00 AM - 12:00 PM",
                    startTimeString: "11:00:00",
                    endTimeString: "12:00:00"
                }, {
                    timeText: "12:00 PM - 1:00 PM",
                    startTimeString: "12:00:00",
                    endTimeString: "13:00:00"
                }, {
                    timeText: "1:00 PM - 2:00 PM",
                    startTimeString: "13:00:00",
                    endTimeString: "14:00:00"
                }, {
                    timeText: "2:00 PM - 3:00 PM",
                    startTimeString: "14:00:00",
                    endTimeString: "15:00:00"
                }, {
                    timeText: "3:00 PM - 4:00 PM",
                    startTimeString: "15:00:00",
                    endTimeString: "16:00:00"
                }, {
                    timeText: "4:00 PM - 5:00 PM",
                    startTimeString: "16:00:00",
                    endTimeString: "17:00:00"
                }, {
                    timeText: "5:00 PM - 6:00 PM",
                    startTimeString: "17:00:00",
                    endTimeString: "18:00:00"
                }, {
                    timeText: "6:00 PM - 7:00 PM",
                    startTimeString: "18:00:00",
                    endTimeString: "19:00:00"
                }, {
                    timeText: "7:00 PM - 8:00 PM",
                    startTimeString: "19:00:00",
                    endTimeString: "20:00:00"
                }, {
                    timeText: "8:00 PM - 9:00 PM",
                    startTimeString: "20:00:00",
                    endTimeString: "21:00:00"
                }, {
                    timeText: "9:00 PM - 10:00 PM",
                    startTimeString: "21:00:00",
                    endTimeString: "22:00:00"
                }, {
                    timeText: "10:00 PM - 11:00 PM",
                    startTimeString: "22:00:00",
                    endTimeString: "23:00:00"
                }, {
                    timeText: "11:00 PM - 0:00 AM",
                    startTimeString: "23:00:00",
                    endTimeString: "00:00:00"
                }
            ],

            assignMonthSelection: [
                {
                    monthText: "January",
                    monthString: "01"
                }, {
                    monthText: "Febuary",
                    monthString: "02"
                }, {
                    monthText: "March",
                    monthString: "03"
                }, {
                    monthText: "April",
                    monthString: "04"
                }, {
                    monthText: "May",
                    monthString: "05"
                }, {
                    monthText: "June",
                    monthString: "06"
                }, {
                    monthText: "July",
                    monthString: "07"
                }, {
                    monthText: "August",
                    monthString: "08"
                }, {
                    monthText: "September",
                    monthString: "09"
                }, {
                    monthText: "October",
                    monthString: "10"
                }, {
                    monthText: "November",
                    monthString: "11"
                }, {
                    monthText: "December",
                    monthString: "12"
                }
            ],
            responseList: [
                { questions: ['1. What did you have to do', '2. What did you like'], answers: ['a1', 'a2'] },
                { questions: ['1. What did you have to do'], answers: ['idk'] },
                { questions: ['1. What did you like'], answers: ['none'] },
                { questions: ['1. What did you dislike'], answers: ['everything'] }
            ],
            collapses: []
        }
    },
    mounted() {
        // If tester response given, collapse.
        if (this.current == 1) {
            this.collapses = this.initializeCollapse();
        }
        // If user exists, set type
        if (window.localStorage.getItem("userType")) {
            this.userType = parseInt(window.localStorage.getItem("userType"));
            // Else, ask for login
        } else {
            this.$router.push({
                name: 'login',
            })
        }
        this.getFilters();
        this.getLatestTesterList();
        this.getAddTesterList();

        let curYear = new Date().getFullYear();
        // For selection, let user select up to 10 years ahead
        for (let i = 0; i < 10; i++) {
            this.assignYearSelection.push({ yearText: (curYear + i).toString() })
        }
        // Set years and month
        this.assignYearSelected = today.getFullYear();
        this.assignMonthSelected = "01";

        // Get total number of days in the assigned month
        let totalDays = new Date(parseInt(this.assignYearSelected), parseInt(this.assignMonthSelected), 0).getDate();
        this.assignDaySelection = [];

        // Set all days as an option for the specified month
        for (let i = 1; i <= totalDays; i++) {
            let date = i.toString();
            // Add a "0" before the single digit days. For eg. Aug 5 => Aug 05
            if (i < 10) {
                date = "0" + date;
            }
            this.assignDaySelection.push({ dayText: date });
        }
        this.assignDaySelected = "01";
    },
    methods: {
        // return field values that are not added to selectedFieldValues
        returnNotAddedValues: function (fieldValues) {
            return fieldValues.filter(value => !value.isAdded)
        },

        // retrieve filters from Firestore
        getFilters: function () {
            let that = this;
            that.isLoading = true;
            FilteringTesters.getFilter(
            )
                .then(res => {
                    // Set fields for testers and the types of variants
                    that.testerFields = res.data.testerFields
                    that.variantsList = res.data.variantsList

                    console.log("vals", that.testerFields[0].fieldValues[1].isAdded)

                    that.isLoading = false;
                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    that.isLoading = false;
                });
        },

        // add the clicked field value to selectedFieldValues
        handleFieldValue: function (fieldValue, field_index) {
            // Get variants
            const numberOfVariants = this.variantsList.length
            const variant = this.variantsList[field_index % numberOfVariants]

            // Get the target value
            const targetValue = this.testerFields[field_index].fieldValues.filter(value => value.value === fieldValue)
            targetValue.forEach(value => value.isAdded = true)

            // Set the field values
            this.selectedFieldValues.push({ fieldValue, variant, field_index })
        },

        // remove the selected field value from selectedFieldValues
        handleSelectedFieldValue: function (fieldValue, field_index) {
            const targetValue = this.testerFields[field_index].fieldValues.filter(value => value.value === fieldValue)
            targetValue.forEach(value => value.isAdded = false)

            this.selectedFieldValues = this.selectedFieldValues.filter(value => value.fieldValue !== fieldValue)

        },

        // remove all selected field values from selectedFieldValues
        handleClear: function () {
            this.selectedFieldValues.forEach(value => {
                this.handleSelectedFieldValue(value.fieldValue, value.field_index)
            })
            this.refreshAddTesterList()
        },

        // initialize/update the addTesterList based on the page related variables
        getAddTesterList: function () {
            let that = this;
            that.isLoading = true;

            // Get the tester fields
            const fireStoreFilter = that.testerFields.map(field => { return { fieldName: field.fieldName, fieldValues: [] } })

            // Push the values of the field
            that.selectedFieldValues.forEach(field => {
                fireStoreFilter[field.field_index].fieldValues.push(field.fieldValue)
            })

            // Get tester object
            FilteringTesters.getTester(
                this.gameId,
                this.addPageNum,
                this.addPageSize,
                fireStoreFilter
            )
                .then(res => {
                    let res_data = res.data;
                    // Add tester to the list of testers
                    that.addTesterList = that.addTesterList.concat(res_data.testerList);
                    // Add page and update total number of pages
                    that.addTotalPage = res_data.totalPage;
                    if (that.addPageNum == res_data.totalPage) {
                        that.addIsLast = true;
                    }
                    that.isLoading = false;

                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    that.isLoading = false;
                });
        },

        // initialize/update lalatestTesterIDs
        getLatestTesterList: function () {
            let that = this;
            that.isLoading = true;
            // Get project with specified gameId
            GamesObject.getProject(
                this.gameId
            )
                .then(res => {
                    // Set latest tester to the tester of the returned project.
                    that.latestTesterIDs = res.data.testerIds
                    that.isLoading = false;

                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    that.isLoading = false;
                });
        },

        // update page related variables
        addNextPage: function () {
            // If not final page
            if (this.addPageNum != this.addTotalPage) {
                // Go to next page
                this.addPageNum = this.addPageNum + 1;
                // If final page, set bool to true.
                if (this.addPageNum == this.addTotalPage) {
                    this.addIsLast = true;
                }
                this.getAddTesterList();
            }
        },

        // refresh addTesterList
        refreshAddTesterList: function () {
            this.addTesterList = [];
            this.addPageNum = 1;
            this.addTotalPage = 1;
            this.addIsLast = false;
            this.getAddTesterList();
        },
        // Add tester
        handleAddTester: function () {
            this.refreshAddTesterList()
        },
        // Get list of latest testers
        toDetailTest: function () {
            this.getLatestTesterList();
            this.current = 0;
        },
        // Get info about tester.
        getTesterInfo: function () {
            let that = this;
            that.isLoading = true;
            // Get user profile of tester
            UserObject.getProfile(
                this.assignTesterId
            )
                .then(res => {
                    console.log("get add tester info");
                    let res_data = res.data;
                    console.log(res_data);
                    // Set assigned tester to the tester data that was returned
                    that.assigntesterInfo = res_data;
                    that.isLoading = false;
                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    that.isLoading = false;
                });
        },
        // Get all responses
        getAllResponse: function () {
            let that = this;
            that.isLoading = true;
            // Get responses
            Firestore.getAllResponses(
                this.assignTesterId
            )
                .then(res => {
                    console.log("get all response");
                    let res_data = res.data;
                    console.log(res_data);
                    // Set the list of responses to returned data
                    that.responseList = res_data;
                    that.isLoading = false;
                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    that.isLoading = false;
                });
        },
        // Add tester
        addTester: function () {
            this.refreshAddTesterList()
            this.current = 2;
        },
        // Handle responses
        handleGoResponse: function (testerId) {
            this.assignTesterId = testerId;
            this.current = 1;
            this.collapses = this.initializeCollapse();
        },
        // Handle a selected time slot
        handleEditTimeSlot: function (testerId, timeSlotList) {
            this.assignTesterId = testerId;
            this.assigntesterTimeSlotList = timeSlotList;
            this.current = 3;
            this.getTesterInfo();
        },

        // remove a tester
        handleRemoveTester: function (testerId) {
            // Ask for confirmation
            const answer = window.confirm("Do you really want to remove this tester? All imformation will be lost forever! (A long time!)")
            // If user confirms deletion
            if (answer) {
                let that = this;
                that.isLoading = true;
                // Delete user from database
                GameTesting.deleteTester(
                    this.gameId,
                    testerId
                )
                    .then(res => {
                        that.isLoading = false;
                        this.getLatestTesterList();
                    })
                    .catch(function (error) { // request failure handler
                        console.log(error);
                        that.isLoading = false;
                    });
            }
        },

        initializeCollapse: function () {
            for (let i = 0; i < this.responseList.length; i++) {
                this.collapses.push({ show: false });
            }
            return this.collapses;
        },

        openAll: function () {
            this.collapses.forEach(collapse => {
                collapse.show = true
            })
        },

        closeAll: function () {
            this.collapses.forEach(collapse => {
                collapse.show = false
            })
        },
        // Handle selection of answers
        handleSelect: function (box, event) {
            // The index that was selected
            const idx = event.target.selectedIndex;
            // If selection was made in the year section
            if (box == "year") {
                // Set assigned year
                this.assignYearSelected = this.assignYearSelection[idx].yearText;
                // If month was selected and isnt empty
                if (this.assignMonthSelected != "") {
                    // Present a list of all days in the month for user to select
                    let totalDays = new Date(parseInt(this.assignYearSelected), parseInt(this.assignMonthSelected), 0).getDate();
                    this.assignDaySelection = [];
                    for (let i = 1; i <= totalDays; i++) {
                        let date = i.toString();
                        if (i < 10) {
                            date = "0" + date;
                        }
                        this.assignDaySelection.push({ dayText: date });
                    }
                }
                // If month section
            } else if (box == "month") {
                // Set month
                this.assignMonthSelected = this.assignMonthSelection[idx].monthString;
                // If year selection is not emtpy
                if (this.assignYearSelected != "") {
                    // Present a list of all days in the month for user to select
                    let totalDays = new Date(parseInt(this.assignYearSelected), parseInt(this.assignMonthSelected), 0).getDate();
                    this.assignDaySelection = [];
                    for (let i = 1; i <= totalDays; i++) {
                        let date = i.toString();
                        if (i < 10) {
                            date = "0" + date;
                        }
                        this.assignDaySelection.push({ dayText: date });
                    }
                }
                // If day section, set day
            } else if (box == "day") {
                this.assignDaySelected = this.assignDaySelection[idx].dayText;
                // Else if hour selection, set hour
            } else {
                this.assignHourSelected = idx;
            }
        },
        // Handle adding game to a timeslot
        handleAdd: function () {
            // Set timeslot
            let startTime = this.assignYearSelected + "-" + this.assignMonthSelected + "-" + this.assignDaySelected + "T" + this.assignHourSelection[this.assignHourSelected].startTimeString;
            let endTime = this.assignYearSelected + "-" + this.assignMonthSelected + "-" + this.assignDaySelected + "T" + this.assignHourSelection[this.assignHourSelected].endTimeString;
            let timeSlot = [startTime, endTime];

            let that = this;
            that.isLoading = true;
            // Assign a time slot to specific game ID.
            GameTesting.assignTimeSlot(
                this.gameId,
                "61b50a36e7767c003f6fd605",
                timeSlot
            )
                .then(res => {
                    that.isLoading = false;
                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    that.isLoading = false;
                });
        }
    }
}
</script>

<style>
#title-wrapper {
    margin-right: 5%;
}

#game-detail-testers {
    margin-right: 0;
}

#game-detail-testers-add {
    margin-right: 5%;
}

#game-detail-testers-response {
    margin-right: 5%;
}

#game-detail-testers-assign {
    margin-right: 5%;
}

.addtester-back {
    height: 21px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 21px;
    text-decoration-line: underline;
    color: #000000;
    margin-bottom: 34px;
    cursor: pointer;
}

#gamedetail-pic {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 5px;
    display: inline-block;
    vertical-align: top;
}

#gamedetail-name {
    position: relative;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
}

#gamedetail-company {
    position: relative;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 20px;
}

#gamedetail-endtime {
    position: relative;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 16px;
}

.add-new-tester {
    position: absolute;
    height: 15px;
    top: 100px;
    right: 46px;
    background: #FF7222 !important;
    border: 0 !important;
    margin: 0.5rem;
    height: 2rem;
    float: right;
    display: flex;
    align-items: center;
}

#tester-list {
    margin-top: 50px;
    margin-right: 5%;
    column-count: 2;
    column-gap: 5%;
}

.white-text {
    color: #000000;
}

.game-detail-testers-add-title {
    margin-top: 14px;
    height: 46px;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 46px;
    color: #C4C2C2;
}

.game-detail-tester-lst-ctn {
    width: 100%;
}

.show-more {
    margin-top: 8px;
    margin-bottom: 20px;
    width: 100%;
    height: 38px;
    background: #666464;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 10px;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 38px;
    color: #333333;
    text-align: center;
    cursor: pointer;
}

.add-tester-no-tester,
.no-response {
    width: 100%;
    margin-top: 50px;
}

.add-tester-no-tester-img,
.no-response-img {
    position: absolute;
    top: 300px;
    height: 102px;
    left: 50%;
    margin-left: -60px;
}

.add-tester-no-tester-txt,
.no-response-txt {
    height: 18px;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
    color: #383737;
    margin-top: 160px;
}

.game-detail-assign-ctn {
    position: relative;
    display: flex;
    width: 100%;
}

.game-detail-assign-date-item {
    height: 42px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 42px;
    color: #414040;
    margin-right: 38px;
    display: flex;
}

.game-detail-assign-btn {
    position: absolute;
    top: 7px;
    right: 0;
    width: 75px;
    height: 28px;
    background: rgba(229, 83, 66, 0.6);
    border: 1px solid rgba(229, 83, 66, 0.6);
    box-sizing: border-box;
    border-radius: 5px;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    color: #FFFFFF;
}

.game-detail-assign-selection-box {
    height: 23px;
    margin-top: 9.5px;
    margin-left: 12px;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    background: #36393F;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;
    text-align: center;
    color: #FFFFFF;
}

select:focus {
    border: 2px rgba(229, 83, 66, 0.6) solid !important;
}

select:hover {
    border: 2px rgba(229, 83, 66, 0.6) solid !important;
}

.response-title {
    width: 100%;
    text-align: left !important;
}

.response-title:focus {
    outline: none;
    box-shadow: none;
}

.response-title:target {
    outline: none;
    box-shadow: none;
}

.response-detail {
    background-color: transparent !important;
    border: 1px solid white !important;
}

.all {
    background-color: transparent !important;
    color: #3c3c3d !important;
}

.all:hover {
    background-color: transparent !important;
    color: #975952 !important;
}

.all:focus {
    background-color: transparent !important;
    color: #D25244 !important;
}

.active-style {
    background-color: #E9E9EA !important;
    color: #666464 !important;
    outline: none;
    box-shadow: none;
}

.hidden-style {
    background-color: transparent !important;
    color: #666464 !important;
}

.response-text {
    margin-bottom: 2rem;
}
</style>
