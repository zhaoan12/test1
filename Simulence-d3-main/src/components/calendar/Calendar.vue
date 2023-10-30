<template>
    <div id='calendar-page'>
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>
        
        <div class="d-flex">
            <navigator :flag="navFlag" />
            <div class="title-header">
                <h1> Calendar </h1>
            </div>
            <div class="calendar-content-ctn">
                <div class="calendar-side">
                    <div class="calendar-item">
                        <div class="calendar-title">
                            <img class="calendar-arrow arrow-left" src="../../assets/let-arrow.png" @click="preMonth">
                            {{ currMonth }} {{ curr.getMonth() == 0 ? curr.getFullYear() - 1:curr.getFullYear() }}
                            <img class="calendar-arrow arrow-right" src="../../assets/right-arrow.png" @click="nextMonth">
                        </div>
                        <div class="week-name calendar-row">
                            <div class="date-week" v-for="day in weekStr" :key="day">{{ day }}</div>
                        </div>
                        <div class="layout-flex calendar-row" style="flex-wrap: wrap;">
                            <div
                            :class="{'date-day': true, 'item.class': true}"
                            v-for="(item, idx) in dateItem.days"
                            :key="item"
                            @click="changeCurrDay(item.day, idx)">
                            <div class="date-item-box" :style="{'background': (currDay == item.day ? 'rgba(229, 83, 66, 0.6)': ''), 'border': (currDay == item.day ? '' : item.today ? '1px solid ':'#E55342')}"></div>
                            <p class="cal-txt" :style="{'color': (currDay == item.day ? '#FFFFFF' : item.events.length != 0 ? '#E55342':'#A7A3A3')}">{{ item.day }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detail-side">
                <div class="detail-side-title-ctn">
                    <div class="detail-side-title-day">{{ currWeekDay }}</div>
                    <div class="detail-side-title-date">{{ currMonth }} &nbsp {{ currDay }}</div>
                    <div class="detail-side-title-divide"></div>
                </div>
                <div class="detail-side-project-lst-ctn">
                    <div v-if="currEvents.length == 0" class="detail-no-proejct">No project plans</div>
                    <div
                    class="detail-side-project-item"
                    v-for="proj in currEvents"
                    :key="item"
                    >
                    <img class="detail-side-game-pic" :src="proj.img">
                    <div class="detail-side-game-name">{{ proj.gameName }}</div>
                    <div class="detail-side-game-company">{{ proj.gameStudio }}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>

<script>
import GamesObject from "../../Firestore/GamesObject";

var Moment = require("../../util/moment.js");
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
import Firestore from '../../Firestore'
import navigator from '../layout/NavBarNew.vue';
import Loading from '../loading/index.vue';
export default {
    name: "calendar",
    components: {
        navigator,
        Loading
    },
    data() {
        return {
            msg: "calendar",
            isLoading: false,
            navFlag: window.localStorage.getItem("userType") == 1 ? 3 : 3,
            userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
            weekStr: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            dateItem: {},
            curr: new Date(DATE_YEAR, DATE_MONTH, 1),
            currMonth: "",
            calenderList: [],
            eventDays: [],
            currDay: -1,
            currEvents: [],
            currWeekDay: "",
            currDateText: ""
        }
    },
    mounted() {
        if (window.localStorage.getItem("userType")) {
            this.userType = parseInt(window.localStorage.getItem("userType"));
            console.log("Calendar userType: ", parseInt(this.userType));
        } else {
            this.$router.push({
                name: 'login',
            })
        }
        this.loadGameList();
        let nowYear = this.curr.getFullYear();
        let nowMonth = this.curr.getMonth();
        let firstDay = new Date(nowYear, nowMonth, 1);
        firstDay.setMonth(nowMonth - 1);
        let weekDay = firstDay.getDay();
        this.currWeekDay = this.getWeekDay(weekDay);
    },
    methods: {
        createDateListData: function() {
            let now = this.curr;
            let momentDate = Moment(now).add(0, "month").date;
            let year = momentDate.getFullYear();
            let month = momentDate.getMonth();
            let days = [];
            let last = new Date(year, month, 1);
            last.setMonth(month - 1);
            let totalDay = this.getTotalDayByMonth(year, month);
            let lastDate = Moment(last).add(0, "month").date;
            let lastTotalDay = this.getTotalDayByMonth(lastDate.getFullYear(), lastDate.getMonth());
            let week = this.getWeek(year, month, 1);
            let start = -week + 1;
            for (let i = start; i <= totalDay; i++) {
                let dayCount = i;
                let events = [];
                for (let j = 0; j < this.calenderList.length; j++) {
                    if (this.eventDays[j] == dayCount) {
                        events.push(this.calenderList[j]);
                    }
                }
                let tempWeek = -1;
                if (i <= 0) {
                    dayCount = "";
                }
                if (i > 0) {
                    tempWeek = this.getWeek(year, month, i);
                }
                let oneWeek = "";
                let today = false;
                if (tempWeek == 6) {
                    oneWeek = 6
                }
                if (month == 0) {
                    month = 12;
                    year = year - 1;
                }
                if (i == DATE_DAY && year == DATE_YEAR && month == DATE_MONTH) {
                    today = true;
                    this.currDay = i;
                    console.log("chosen i", i);
                }
                days.push({
                    day: dayCount,
                    oneWeek,
                    today,
                    events
                })
            }
            let dateItem = {
                id: year + '-' + month,
                year: year,
                month: month,
                days: days
            }
            this.dateItem = dateItem;
        },
        getTotalDayByMonth: function(year, month) {
            month = parseInt(month, 10);
            let d = new Date(year, month, 0);
            return d.getDate();
        },
        getWeek: function(year, month, day) {
            let d = new Date(year, month - 1, day);
            return d.getDay();
        },
        preMonth: function() {
            this.curr.setMonth(this.curr.getMonth() - 1);
            this.currDay = 1;
            // Set new week day
            let nowYear = this.curr.getFullYear();
            let nowMonth = this.curr.getMonth();
            let firstDay = new Date(nowYear, nowMonth, 1);
            firstDay.setMonth(nowMonth - 1);
            let weekDay = firstDay.getDay();
            this.currWeekDay = this.getWeekDay(weekDay);
            this.loadGameList();
        },
        nextMonth: function() {
            this.curr.setMonth(this.curr.getMonth() + 1);
            this.currDay = 1;
            // Set new week day
            let nowYear = this.curr.getFullYear();
            let nowMonth = this.curr.getMonth();
            let firstDay = new Date(nowYear, nowMonth, 1);
            firstDay.setMonth(nowMonth - 1);
            let weekDay = firstDay.getDay();
            this.currWeekDay = this.getWeekDay(weekDay);
            this.loadGameList();
        },
        updateMonth: function() {
            if (this.curr.getMonth() == 0) {
                this.currMonth = "DECEMBER";
            } else if (this.curr.getMonth() == 1) {
                this.currMonth = "JANUARY";
            } else if (this.curr.getMonth() == 2) {
                this.currMonth = "FEBRUARY";
            } else if (this.curr.getMonth() == 3) {
                this.currMonth = "MARCH";
            } else if (this.curr.getMonth() == 4) {
                this.currMonth = "APRIL";
            } else if (this.curr.getMonth() == 5) {
                this.currMonth = "MAY";
            } else if (this.curr.getMonth() == 6) {
                this.currMonth = "JUNE";
            } else if (this.curr.getMonth() == 7) {
                this.currMonth = "JULY";
            } else if (this.curr.getMonth() == 8) {
                this.currMonth = "AUGUST";
            } else if (this.curr.getMonth() == 9) {
                this.currMonth = "SEPTEMBER";
            } else if (this.curr.getMonth() == 10) {
                this.currMonth = "OCTOBER";
            } else if (this.curr.getMonth() == 11) {
                this.currMonth = "NOVEMBER";
            }
        },
        changeCurrDay: function(newDay, idx) {
            if (newDay > 0) {
                this.currDay = newDay;
                this.currEvents = this.dateItem.days[idx].events;
                let weekDay = idx % 7;
                this.currWeekDay = this.getWeekDay(weekDay);
            }
        },
        getWeekDay: function(weekDay) {
            if (weekDay == 0) {
                return "SUNDAY";
            } else if (weekDay == 1) {
                return "MONDAY";
            } else if (weekDay == 2) {
                return "TUESDAY";
            } else if (weekDay == 3) {
                return "WEDNESDAY";
            } else if (weekDay == 4) {
                return "THURSDAY";
            } else if (weekDay == 5) {
                return "FRIDAY";
            } else if (weekDay == 6) {
                return "SATURDAY";
            }
        },
        loadGameList: function() {
            let that = this;
            let tempNewYear = this.curr.getFullYear();
            let tempNewMonth = this.curr.getMonth();
            if (this.curr.getMonth() == 0) {
                tempNewYear = tempNewYear - 1;
                tempNewMonth = 12;
            }
            if (tempNewMonth.toString().length == 1) {
                tempNewMonth = "0" + tempNewMonth;
            }
            let paramDate = tempNewYear + "-" + tempNewMonth;
            console.log("param date: ", paramDate);
            that.isLoading = true;
            if (this.userType == 1) {
                // developer user
                GamesObject.getCalendar(window.localStorage.getItem('userId'), paramDate)
                .then(res => {
                    let res_data = res.data;
                    that.calenderList = res_data;
                    let newEventDays = [];
                    
                    // add games to date slots in calendar
                    for (let i = 0; i < that.calenderList.length; i++) {
                        let eventDay = new Date(that.calenderList[i].endTime);
                        let eventDate = eventDay.getDate();
                        newEventDays.push(eventDate);
                    }
                    that.eventDays = newEventDays;
                    that.createDateListData();
                    that.updateMonth();
                    let firstNewYear = that.curr.getFullYear();
                    let firstNewMonth = that.curr.getMonth();
                    if (that.curr.getMonth() == 0) {
                        firstNewYear = tempNewYear - 1;
                        firstNewMonth = 12;
                    }
                    firstNewMonth = firstNewMonth - 1;
                    let newFirstDay = new Date(firstNewYear, firstNewMonth, 1);
                    that.currEvents = that.dateItem.days[newFirstDay.getDay()].events;
                    
                    // get events for today's date
                    for (let idx = 0; idx < that.dateItem.days.length; idx++) {
                        if (that.dateItem.days[idx].today) {
                            that.currEvents = that.dateItem.days[idx].events;
                        }
                    }
                    that.isLoading = false;
                })
                .catch(e => { // request failure handler
                    alert(e);
                    console.log(e);
                    that.isLoading = false;
                });
            } else if (this.userType == 2) {
                // admin user
                GamesObject.getCalendar("", paramDate)
                .then(res => {
                    let res_data = res.data;
                    that.calenderList = res_data;
                    let newEventDays = [];
                    
                    // add games to date slots in calendar
                    for (let i = 0; i < that.calenderList.length; i++) {
                        let eventDay = new Date(that.calenderList[i].endTime);
                        let eventDate = eventDay.getDate();
                        newEventDays.push(eventDate);
                    }
                    that.eventDays = newEventDays;
                    that.createDateListData();
                    that.updateMonth();
                    let firstNewYear = that.curr.getFullYear();
                    let firstNewMonth = that.curr.getMonth();
                    if (that.curr.getMonth() == 0) {
                        firstNewYear = tempNewYear - 1;
                        firstNewMonth = 12;
                    }
                    firstNewMonth = firstNewMonth - 1;
                    let newFirstDay = new Date(firstNewYear, firstNewMonth, 1);
                    that.currEvents = that.dateItem.days[newFirstDay.getDay()].events;
                    
                    // get events for today's date
                    for (let idx = 0; idx < that.dateItem.days.length; idx++) {
                        if (that.dateItem.days[idx].today) {
                            that.currEvents = that.dateItem.days[idx].events;
                        }
                    }
                    that.isLoading = false;
                })
                .catch(e => { // request failure handler
                    alert(e.error);
                    console.log(e.error);
                    that.isLoading = false;
                });
            } else if (this.userType == 0) {
                // tester user
                GamesObject.getTesterCalendar(window.localStorage.getItem('userId'), paramDate)
                .then(res => {
                    let res_data = res.data;
                    let tempCalendarList= res_data;
                    let newEventDays = [];
                    let newCalenderList = [];
                    // add games to date slots in calendar
                    for (let i = 0; i < tempCalendarList.length; i++) {
                        for (let j = 0; j < tempCalendarList[i].timeSlots.length; j++) {
                            let eventDay = new Date(tempCalendarList[i].timeSlots[j].slice(1, 20));
                            let eventDate = eventDay.getDate();
                            newEventDays.push(eventDate);
                            newCalenderList.push(tempCalendarList[i]);
                        }
                    }
                    that.eventDays = newEventDays;
                    that.calenderList = newCalenderList;
                    that.createDateListData();
                    that.updateMonth();
                    let firstNewYear = that.curr.getFullYear();
                    let firstNewMonth = that.curr.getMonth();
                    if (that.curr.getMonth() == 0) {
                        firstNewYear = tempNewYear - 1;
                        firstNewMonth = 12;
                    }
                    firstNewMonth = firstNewMonth - 1;
                    let newFirstDay = new Date(firstNewYear, firstNewMonth, 1);
                    that.currEvents = that.dateItem.days[newFirstDay.getDay()].events;
                    // get events for today's date
                    for (let idx = 0; idx < that.dateItem.days.length; idx++) {
                        if (that.dateItem.days[idx].today) {
                            that.currEvents = that.dateItem.days[idx].events;
                        }
                    }
                    that.isLoading = false;
                })
                .catch(e => { // request failure handler
                    alert(e.error);
                    console.log(e.error);
                    that.isLoading = false;
                });
            }
        }
    }
}
</script>

<style>
#calendar-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: scroll;
    background: #F5F5F5;
}
::-webkit-scrollbar {
    width: 5px;
    height: 100%;
    border-radius: 10px;
    background: #36393F;
}
::-webkit-scrollbar-thumb {
    width: 5px;
    background: #E9E9EA;
    border-radius: 10px;
}
.title-header {
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75px;
    width: 100%;
    box-shadow: 0 4px 10px -6px grey;
    z-index: 2;
}

.title-header h1 {
    color: #FF7222;
    font-weight: bold;
}
.calendar-content-ctn {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
}
.calendar-side {
    position: relative;
    margin-top: 65px;
    width: 60%;
    height: 100%;
    overflow: scroll;
}
.calendar-item {
    position: absolute;
    margin-top: 150px;
    margin-bottom: 145px;
    width: 429.31px;
    height: 392px;
    left: 50%;
    margin-left: -114.655px;
}
.calendar-title {
    position: absolute;
    width: 220px;
    display: flex;
    left: 50%;
    margin-left: -110px;
    display: inline-block;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 15px;
    color: #535252;
}
.calendar-arrow {
    position: absolute;
    width: 8px;
    height: 12px;
    margin-top: 1px;
    margin-left: 10px;
    margin-right: 10px;
}
.arrow-left {
    left: 0;
}
.arrow-right {
    right: 0;
}
.week-name {
    margin-top: 24px;
}
.calendar-row {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.date-week {
    width: 61.33px;
    margin-top: 30px;
    margin-bottom: 15px;
    justify-content: center;
    align-content: center;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 15px;
    color: #555353;
}
.date-day {
    position: relative;
    width: 61.33px;
    height: 46px;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 15px;
    color: #5f5f5f;
    cursor: pointer;
}
.date-item-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    margin: 8px 15.665px 8px 15.665px;
    border-radius: 10px;
    z-index: -1;
}
.detail-side {
    position: relative;
    padding-left: 54px;
    padding-right: 54px;
    float: right;
    margin-top: 65px;
    width: 40%;
    height: 100%;
    background: rgba(229, 83, 66, 0.6);
}
.detail-side-title-day {
    margin-top: 126px;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 46px;
    color: #FFFFFF;
}
.detail-side-title-date {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 46px;
    color: #FFFFFF;
}
.detail-side-title-divide {
    width: 100%;
    height: 0px;
    margin-top: 23px;
    border: 2px solid #C3C2C2;
    background: #C3C2C2;
}
.detail-no-proejct {
    margin-top: 28px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 15px;
    color: #FFFFFF;
}
.detail-side-project-lst-ctn {
    position: relative;
    width: 100%;
    margin-top: 32px;
}
.detail-side-project-item {
    position: relative;
    width: 100%;
    margin-top: 23px;
    height: 80px;
}
.detail-side-game-pic {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    border-radius: 5px;
}
.detail-side-game-name {
    position: absolute;
    top: 0;
    left: 107px;
    width: 70%;
    height: 46px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 46px;
    color: #FFFFFF;
    overflow: hidden;
    text-overflow: ellipsis;
}
.detail-side-game-company {
    position: absolute;
    top: 34px;
    left: 107px;
    width: 60%;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 46px;
    color: #C3C2C2;
    overflow: hidden;
    text-overflow: ellipsis;
}
.cal-txt {
    margin-top: 14px;
}
</style>
