<template>
    <div class="game-info-edit">
        <div>
            {{updateColor()}}
        </div>
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>

        <imageCropper
        id="gameinfo-image-cropper"
        v-if="cropperOn"
        :img="imgFile.src"
        :imgType="imgFile.type"
        stencilComponent="rectangle-stencil"
        :cropperProps="{aspectRatio: 1/1}"
        @cropConfirmed="handleCropperConfirm"
        @cropCanceled="handleCropperCancel"/>

        <div id="addgame-pic" @mouseover="showShade" @mouseleave="hideShade" v-bind:style="{ backgroundImage: 'url(' + this.newData.img + ')', backgroundSize: 'cover' }">
            <div id="addgame-upload-text" v-if="shadeOn" class="white-text">GAME ICON</div>
            <input id="addgame-upload-button" v-if="shadeOn" type="file" ref="file" @change="uploadImg($event)" accept="image/*" />
            <div id="addgame-shade" v-if="shadeOn"></div>
        </div>
        <div id="basic-info">
            <div class="white-text" id="addgame-name">PROJECT NAME</div>
            <input class="addgame-smallinput white-text" v-if="!fromGame" type="text" v-model="newData.gameName" />
            <input class="addgame-smallinput white-text" v-if="fromGame" type="text" value="newData.gameName" v-model="newData.gameName" />
            <div class="white-text" id="addgame-company">STUDIO NAME</div>
            <input class="addgame-smallinput white-text" v-if="!fromGame" type="text" v-model="newData.company" />
            <input class="addgame-smallinput white-text" v-if="fromGame" type="text" value="newData.company" v-model="newData.company" />
        </div>
        <input id="addgame-confirm" type="submit" value="CONFIRM" @click.prevent="handleConfirm"/>

        <div class="addgame-assign-ctn">
            <div class="addgame-assign-date-item">
                <div class="addgame-inlinetext white-text">Year:</div>
                <select class="addgame-assign-selection-box" @change="handleSelect('year', $event)">
                    <option v-for="(year, idx) in assignYearSelection" :key="year.yearText">{{ year.yearText }}</option>
                </select>
            </div>
            <div class="addgame-assign-date-item">
                <div class="addgame-inlinetext white-text">Month:</div>
                <select class="addgame-assign-selection-box" @change="handleSelect('month', $event)">
                    <option v-for="(month, idx) in assignMonthSelection" :key="month.monthText">{{ month.monthText }}</option>
                </select>
            </div>
            <div class="addgame-assign-date-item">
                <div class="addgame-inlinetext white-text">Day:</div>
                <select class="addgame-assign-selection-box" @change="handleSelect('day', $event)">
                    <option v-for="(day, idx) in assignDaySelection" :key="day.dayText">{{ day.dayText }}</option>
                </select>
            </div>
            <div class="addgame-assign-date-item">
                <div class="addgame-inlinetext white-text">Hour:</div>
                <select class="addgame-assign-selection-box" @change="handleSelect('hour', $event)">
                    <option v-for="(hour, idx) in assignHourSelection" :key="hour.timeText">{{ hour.timeText }}</option>
                </select>
            </div>
        </div>

        <div class="addgame-title white-text">DESCRIPTION</div>
        <textarea class="addgame-biginput white-text" v-if="!fromGame" v-model="newData.description" />
        <textarea class="addgame-biginput white-text" v-if="fromGame" value="newData.description" v-model="newData.description" />

        <div class="addgame-title white-text">CONTACT INFO</div>
        <div class="contact-subject">
            <div class="addgame-inlinetext white-text">QA Lead: </div>
            <div class="addgame-inlinetext white-text">Work Phone: </div>
            <div class="addgame-inlinetext white-text">Mobile: </div>
            <div class="addgame-inlinetext white-text">Email: </div>
        </div>
        <div class="contact-content">
            <div v-if="!fromGame">
                <input class="addgame-smallinput contact-input white-text" type="text" v-model="newData.qaLead.name" /><br>
                <input class="addgame-smallinput contact-input white-text" type="text" v-model="newData.qaLead.workPhone" /><br>
                <input class="addgame-smallinput contact-input white-text" type="text" v-model="newData.qaLead.mobile" /><br>
                <input class="addgame-smallinput contact-input white-text" type="text" v-model="newData.qaLead.email" /><br>
            </div>
            <div v-if="fromGame">
                <input class="addgame-smallinput contact-input white-text" type="text" value="newData.qaLead.name" v-model="newData.qaLead.name" /><br>
                <input class="addgame-smallinput contact-input white-text" type="text" value="newData.qaLead.workPhone" v-model="newData.qaLead.workPhone" /><br>
                <input class="addgame-smallinput contact-input white-text" type="text" value="newData.qaLead.mobile" v-model="newData.qaLead.mobile" /><br>
                <input class="addgame-smallinput contact-input white-text" type="text" value="newData.qaLead.email" v-model="newData.qaLead.email" /><br>
            </div>
        </div>
    </div>
</template>

<script>
    import Firestore from '../../Firestore'
    import imageCropper from '../layout/ImageCropper.vue'
    import Loading from '../loading/index.vue'
    import GamesObject from "../../Firestore/GamesObject";

    const today = new Date();
    function getMimeType(file, fallback = null) {
        const byteArray = (new Uint8Array(file)).subarray(0, 4);
        let header = '';
        for (let i = 0; i < byteArray.length; i++) {
        header += byteArray[i].toString(16);
        }
        switch (header) {
            case "89504e47":
                return "image/png";
            case "47494638":
                return "image/gif";
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
                return "image/jpeg";
            default:
                return fallback;
        }
    }

    export default {
        name: "gameInfoEdit",
        components: {
            imageCropper,
            Loading
        },
        props: {
            data: {
                type: Object
            },
            fromGame: {
                type: Boolean
            }
        },
        data() {
            return {
                userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
                shadeOn: false,
                cropperOn: false,
                isLoading: false,
                defaultGameImg: require("../../assets/game_img_default.png"),
                imgURL: null,
                imgFile: {
                    src: null,
				    type: null
                },
                newData: {
                    gameId: "",
                    developerId: window.localStorage.getItem("userId"),
                    gameName: "",
                    company: "",
                    img: "",
                    endTime: "",
                    description: "",
                    qaLead: {
                        name: "",
                        workPhone: "",
                        mobile: "",
                        email: "",
                    },
                },
                assignYearSelected: "",
                assignMonthSelected: "",
                assignDaySelected: "",
                assignHourSelected: 0,
                assignYearSelection: [],
                assignDaySelection: [],
                assignHourSelection: [
                    {
                        timeText: "0:00 AM",
                        timeString: "00:00:00",
                    }, {
                        timeText: "1:00 AM",
                        timeString: "01:00:00",
                    }, {
                        timeText: "2:00 AM",
                        timeString: "02:00:00",
                    }, {
                        timeText: "3:00 AM",
                        timeString: "03:00:00",
                    }, {
                        timeText: "4:00 AM",
                        timeString: "04:00:00",
                    }, {
                        timeText: "5:00 AM",
                        timeString: "05:00:00",
                    }, {
                        timeText: "6:00 AM",
                        timeString: "06:00:00",
                    }, {
                        timeText: "7:00 AM",
                        timeString: "07:00:00",
                    }, {
                        timeText: "8:00 AM",
                        timeString: "08:00:00",
                    }, {
                        timeText: "9:00 AM",
                        timeString: "09:00:00",
                    }, {
                        timeText: "10:00 AM",
                        timeString: "10:00:00",
                    }, {
                        timeText: "11:00 AM",
                        timeString: "11:00:00",
                    }, {
                        timeText: "12:00 PM",
                        timeString: "12:00:00",
                    }, {
                        timeText: "1:00 PM",
                        timeString: "13:00:00",
                    }, {
                        timeText: "2:00 PM",
                        timeString: "14:00:00",
                    }, {
                        timeText: "3:00 PM",
                        timeString: "15:00:00",
                    }, {
                        timeText: "4:00 PM",
                        timeString: "16:00:00",
                    }, {
                        timeText: "5:00 PM",
                        timeString: "17:00:00",
                    }, {
                        timeText: "6:00 PM",
                        timeString: "18:00:00",
                    }, {
                        timeText: "7:00 PM",
                        timeString: "19:00:00",
                    }, {
                        timeText: "8:00 PM",
                        timeString: "20:00:00",
                    }, {
                        timeText: "9:00 PM",
                        timeString: "21:00:00",
                    }, {
                        timeText: "10:00 PM",
                        timeString: "22:00:00",
                    }, {
                        timeText: "11:00 PM",
                        timeString: "23:00:00",
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
            }
        },
        mounted() {
            this.newData.gameId = this.data.gameId;
            this.newData.gameName = this.data.gameName;
            this.newData.company = this.data.company;
            this.newData.img = this.data.img;
            this.newData.endTime = this.data.endTime;
            this.newData.description = this.data.description;
            this.newData.qaLead.name = this.data.qaLead.name;
            this.newData.qaLead.workPhone = this.data.qaLead.workPhone;
            this.newData.qaLead.mobile = this.data.qaLead.mobile;
            this.newData.qaLead.email = this.data.qaLead.email;

            let curYear = new Date().getFullYear();
            for (let i = 0; i < 10; i++) {
                this.assignYearSelection.push({yearText: (curYear + i).toString()})
            }
            this.assignYearSelected = today.getFullYear();
            this.assignMonthSelected = "01";

            let totalDays = new Date(parseInt(this.assignYearSelected), parseInt(this.assignMonthSelected), 0).getDate();
            this.assignDaySelection = [];
            for (let i = 1; i <= totalDays; i++) {
                let date = i.toString();
                if (i < 10) {
                    date = "0" + date;
                }
                this.assignDaySelection.push({dayText: date});
            }
            this.assignDaySelected = "01";
        },
		reset() {
            this.imgURL = null;
			this.imgFile = {
				src: null,
				type: null
			};
		},
        methods: {
            showShade: function() {
                this.shadeOn = true;
            },

            hideShade: function() {
                this.shadeOn = false;
            },

            uploadImg: function(event) {
                const { files } = event.target;
                if (files && files[0]) {
                    if (this.imgFile.src) {
                        URL.revokeObjectURL(this.imgFile.src)
                    }
                    const blob = URL.createObjectURL(files[0]);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.imgFile = {
                            src: blob,
                            type: getMimeType(e.target.result, files[0].type),
                        };
                    };
                    reader.readAsArrayBuffer(files[0]);
                }
                this.cropperOn = true;
            },

            handleCropperConfirm: function(imgBlob) {
                this.cropperOn = false;
                const reader = new FileReader();
                reader.readAsDataURL(imgBlob); // converts the blob to base64 and calls onload
                reader.onload = () => {
                    this.newData.img = reader.result; // data url
                };
            },

            handleCropperCancel: function() {
                this.cropperOn = false;
            },

            handleSelect(box, event) {
                const idx = event.target.selectedIndex;
                if (box == "year") {
                    this.assignYearSelected = this.assignYearSelection[idx].yearText;
                    if (this.assignMonthSelected != "") {
                        let totalDays = new Date(parseInt(this.assignYearSelected), parseInt(this.assignMonthSelected), 0).getDate();
                        this.assignDaySelection = [];
                        for (let i = 1; i <= totalDays; i++) {
                            let date = i.toString();
                            if (i < 10) {
                                date = "0" + date;
                            }
                            this.assignDaySelection.push({dayText: date});
                        }
                    }
                } else if (box == "month") {
                    this.assignMonthSelected = this.assignMonthSelection[idx].monthString;
                    if (this.assignYearSelected != "") {
                        let totalDays = new Date(parseInt(this.assignYearSelected), parseInt(this.assignMonthSelected), 0).getDate();
                        this.assignDaySelection = [];
                        for (let i = 1; i <= totalDays; i++) {
                            let date = i.toString();
                            if (i < 10) {
                                date = "0" + date;
                            }
                            this.assignDaySelection.push({dayText: date});
                        }
                    }
                } else if (box == "day") {
                    this.assignDaySelected = this.assignDaySelection[idx].dayText;
                } else {
                    this.assignHourSelected = idx;
                }
            },

            handleConfirm: function() {
                this.newData.endTime = this.assignYearSelected + "-" + this.assignMonthSelected + "-" + this.assignDaySelected + "T" + this.assignHourSelection[this.assignHourSelected].timeString;
                if (this.newData.img == "") {
                    this.newData.img = this.defaultGameImg;
                }
                this.$emit('confirmed');

                this.isLoading = true;
                GamesObject.createProject(
                    this.newData.gameId,
                    window.localStorage.getItem("userId"),
                    this.newData.gameName,
                    this.newData.company,
                    this.newData.img,
                    this.newData.endTime,
                    this.newData.description,
                    this.newData.qaLead,
                )
                .then(res => {
                    console.log(res);
                    this.isLoading = false;
                })
                .catch(function (error) { // request failure handler
                    console.log()
                    console.log(error);
                    this.isLoading = false;
                });

                if (this.fromGame) {
                    this.$router.push({
                        name: 'gamedetail',
                    })
                } else {
                    this.$router.push({
                        name: 'dashboard',
                    })
                }
            },
            updateColor: function() {
                var r = document.querySelector(':root');
                r.style.setProperty('--ADDGAMEC', this.$store.state.cardbk);
            },
        },
        destroyed() {
            if (this.imgFile.src) {
                URL.revokeObjectURL(this.imgFile.src)
            }
        }
    }
</script>
:root {
    --ADDGAMEC: #fbfbfb;
}
<style>
#gameinfo-image-cropper {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background: #cac8c8;
    z-index: 200;
}

#addgame-pic {
    position: relative;
    width: 120px;
    height: 120px;
    margin-top: 30px;
    background: #cac8c8;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-sizing: border-box;
    border-radius: 5px;
    display: inline-block;
    vertical-align: top;
    z-index: 1;
}

#addgame-upload-text {
    position: relative;
    left: 12%;
    margin-top: 20px;
    z-index: 3;
}

#addgame-upload-button {
    position: relative;
    left: 15%;
    width: 70%;
    margin-top: 20px;
    z-index: 3;
}

#addgame-shade {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    background: #cac8c8;
    border-radius: 5px;
    display: block;
    z-index: 2;
}

#basic-info {
    position: relative;
    margin-left: 10%;
    display: inline-block;
    vertical-align: center;
}

#addgame-name {
    position: relative;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
}

#addgame-company {
    position: relative;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 18px;
}

.addgame-title {
    margin-top: 30px;
    margin-bottom: 20px;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 13px;
}

#addgame-confirm {
    position: absolute;
    width: 25%;
    height: 40px;
    right: 0%;
    top: 10px;
    background: #FC7727;
    border: none;
    display: inline-block;
    cursor: pointer;
    color: var(--ADDGAMEC);
}

.contact-subject {
    position: relative;
    width: 20%;
    display: inline-block;
}

.contact-content {
    position: relative;
    width: 70%;
    display: inline-block;
}

.contact-input {
    margin-bottom: 10px;
}

.addgame-inlinetext {
    height: 30px;
    margin-bottom: 10px;
}

.addgame-biginput {
    position: relative;
    width: 100%;
    height: 120px;
    background: #cac8c8;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-sizing: border-box;
    border-radius: 6px;
    font-family: Lato;
    font-style: normal;
    white-space: normal;
    vertical-align: top;
}

.addgame-smallinput {
    position: relative;
    width: 300px;
    height: 30px;
    background: #cac8c8;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-sizing: border-box;
    border-radius: 6px;
}

.white-text {
    color: #4b4b4d;
}

.addgame-assign-ctn {
    position: relative;
    margin-top: 30px;
    display: flex;
    width: 100%;
}

.addgame-assign-date-item {
    height: 42px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 42px;
    color: #C4C2C2;
    margin-right: 38px;
    display: flex;
}

.addgame-assign-selection-box {
    height: 23px;
    margin-top: 9.5px;
    margin-left: 12px;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    background: #cac8c8;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;
    text-align: center;
    color: #4b4a4a;
}
</style>
