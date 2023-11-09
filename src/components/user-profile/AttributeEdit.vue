<template>
    <div class="attribute-edit">
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>

        <div class="attribute-assign-ctn">
            <div class="attribute-assign-item">
                <div class="attribute-inlinetext white-text">Age:</div>
                <select class="attribute-assign-selection-box" @change="handleSelect('age', $event)">
                    <option v-for="(age, idx) in ageSelection" :key="age.value">{{ age.value }}</option>
                </select>
            </div>
            <div class="attribute-assign-item">
                <div class="attribute-inlinetext white-text">Gender:</div>
                <select class="attribute-assign-selection-box" @change="handleSelect('gender', $event)">
                    <option v-for="(gender, idx) in genderSelection" :key="gender.value">{{ gender.value }}</option>
                </select>
            </div>
            <div class="attribute-assign-item">
                <div class="attribute-inlinetext white-text">Hours/week:</div>
                <select class="attribute-assign-selection-box" @change="handleSelect('hour', $event)">
                    <option v-for="(hours, idx) in hoursSelection" :key="hours.value">{{ hours.value }}</option>
                </select>
            </div>
        </div>


        <div class="filtering-testers">

            <Transition name="bounce">
              <b-button @click="handleClear" v-if="showClearButton">
                  CLEAR
              </b-button>
            </Transition>
            <b-button v-for="(selectedFieldValue, index) in selectedFieldValues"
            :key="index"
            :id="index"
            class="m-1"
            v-bind:variant="selectedFieldValue.variant"
            @click="handleSelectedFieldValue(selectedFieldValue.fieldValue, selectedFieldValue.field_index)"
            >
            {{selectedFieldValue.fieldValue}}
            </b-button>
                <b-card
                v-for="(fieldObject, field_index) in testerFields"
                :key="fieldObject.field_index"
                :id="fieldObject.field_index"
                >
                <b-button v-b-toggle="'collapse-1-inner'+field_index" size="sm" class="m-1">{{fieldObject.fieldName}}</b-button>
                <b-collapse inline v-bind:id="'collapse-1-inner'+field_index" accordion="field-value-accordion">
                    <b-button
                    v-for="(fieldValue, value_index) in returnNotAddedValues(fieldObject.fieldValues)"
                    :key="value_index"
                    :id="value_index"
                    size="sm"
                    class="m-1"
                    @click="handleFieldValue(fieldValue.value, fieldObject.fieldName, field_index)"
                    >
                    {{fieldValue.value}}
                    </b-button>
                </b-collapse>
                </b-card>
        </div>


        <input id="attribute-confirm" type="submit" value="CONFIRM" @click.prevent="handleConfirm"/>


    </div>
</template>

<script>
    import Firestore from '../../Firestore'
    import Loading from '../loading/index.vue'
    import PlayTesterUser from "../../Firestore/PlayTesterUser";

    export default {
        name: "gameInfoEdit",
        components: {
            Loading
        },
        data() {
            return {
                ageSelected: [],
                genderSelected: [],
                hoursSelected: [],
                platformSelected: [],
                behaviorSelected: [],
                genreSelected: [],
                profileSelected: [],
                purchasingBehaviorSelected: [],
                selectedFieldValues: [], // play tester fields that are selected
                variantsList: ["primary", "success",
                "danger", "warning", "info", "light",
                "dark"], // list of variants to group field values by their field
                showClearButton: true,
                testerFields: [
                    { fieldName : "platform", fieldValues: [{value: "Mobile", isAdded: false}, {value: "Game Console", isAdded: false},
                     {value: "PC/Laptop", isAdded: false}, {value: "Handheld", isAdded: false}, {value: "VR", isAdded: false}
                    ]},
                    { fieldName : "behavior", fieldValues: [{value: "Competition", isAdded: false}, {value: "Completion", isAdded: false},
                     {value: "Community/Social", isAdded: false}, {value: "Design", isAdded: false}, {value: "Destruction", isAdded: false},
                     {value: "Fantasy", isAdded:false}, {value: "Story", isAdded: false}
                    ]},
                    { fieldName : "genre", fieldValues: [{value: "Action", isAdded: false}, {value: "Adventure", isAdded: false},
                    {value: "Casual/Puzzle", isAdded: false}, {value: "Multiplayer Online", isAdded: false}, {value: "Role Playing Game", isAdded: false},
                    {value: "Shooter", isAdded: false}, {value: "Simulation", isAdded: false},
                    {value: "Sports", isAdded: false}, {value: "Strategy", isAdded: false}
                    ]},
                    { fieldName : "profile", fieldValues: [{value: "Gamer in a Past Life", isAdded: false}, {value: "Conventional", isAdded: false},
                     {value: "Popcorn/Recreational", isAdded: false}, {value: "Ultimate Gamer", isAdded: false}, {value: "Time Filler", isAdded: false}
                    ]},
                    { fieldName : "purchasingBehavior", fieldValues: [{value: "One Time Game Purchases", isAdded: false}, {value: "Additional Game Content", isAdded: false},
                     {value: "Lootboxes", isAdded: false}, {value: "Characters", isAdded: false}, {value: "Subsciptions", isAdded: false},
                     {value: "Cosmetics", isAdded: false}, {value: "Free to Play", isAdded: false}
                    ]},
                ], // play tester fields that can be selected in the filter
                userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
                isLoading: false,
                newData: {
                    age: [],
                    testerId: window.localStorage.getItem("userId"),
                    gender: [],
                    hours: [],
                    platform: [],
                    behavior: [],
                    genre: [],
                    profile: [],
                    purchasingBehavior: []
                },

                ageSelection: [
                    {
                        value: "<18"
                    },
                    {
                        value: "18 - 34"
                    },
                    {
                        value: "35 - 54"
                    },
                    {
                        value: "55 - 64"
                    },
                    {
                        value: "65+"
                    }
                ],
                genderSelection: [
                    {
                        value: "Male"
                    },
                    {
                        value: "Female"
                    },
                    {
                        value: "Non Binary"
                    },
                    {
                        value: "Prefer not to say"
                    }
                ],
                hoursSelection: [
                    {
                        value: "0-5"
                    },
                    {
                        value: "6-10"
                    },
                    {
                        value: "11-15"
                    },
                    {
                        value: "16-20"
                    },
                    {
                        value: "21-30"
                    },
                    {
                        value: "31+"
                    }
                ],
            }
        },
        mounted() {
            this.ageSelected.push("<18");
            this.genderSelected.push("Male");
            this.hoursSelected.push("0-5");
        },
        methods: {
            // return field values that are not added to selectedFieldValues
            returnNotAddedValues: function(fieldValues) {
                return fieldValues.filter(value => !value.isAdded)
            },

            // add the clicked field value to selectedFieldValues
            handleFieldValue: function(fieldValue, fieldObject, field_index) {
                const numberOfVariants = this.variantsList.length
                const variant = this.variantsList[field_index % numberOfVariants]

                const targetValue = this.testerFields[field_index].fieldValues.filter(value => value.value === fieldValue)
                targetValue.forEach(value => value.isAdded = true)

                this.selectedFieldValues.push({fieldValue, variant, field_index})
                if (fieldObject == "platform") {
                    this.platformSelected.push(fieldValue);
                } else if (fieldObject == "behavior") {
                    this.behaviorSelected.push(fieldValue);
                } else if (fieldObject == "genre") {
                    this.genreSelected.push(fieldValue);
                }else if (fieldObject == "profile") {
                    this.profileSelected.push(fieldValue);
                }else if (fieldObject == "purchasingBehavior") {
                    this.purchasingBehaviorSelected.push(fieldValue);
                }
            },

            // remove the selected field value from selectedFieldValues
            handleSelectedFieldValue: function(fieldValue, field_index) {
                const targetValue = this.testerFields[field_index].fieldValues.filter(value => value.value === fieldValue)
                targetValue.forEach(value => value.isAdded = false)

                this.selectedFieldValues = this.selectedFieldValues.filter(value => value.fieldValue !== fieldValue)

            },

            // remove all selected field values from selectedFieldValues
            handleClear: function() {
              this.showClearButton = false;
                setTimeout(() => {
                this.ageSelected = ["<18"];
                this.genderSelected = ["Male"];
                this.hoursSelected = ["0-5"];
                this.platformSelected = [];
                this.behaviorSelected = [];
                this.genreSelected = [];
                this.profileSelected = [];
                this.purchasingBehaviorSelected = [];
                this.selectedFieldValues.forEach(value => {
                    this.handleSelectedFieldValue(value.fieldValue, value.field_index)
                })
                this.showClearButton = true;
              }, 500);
            },

            handleSelect(box, event) {
                const idx = event.target.selectedIndex;
                if (box == "age") {
                    this.ageSelected = [this.ageSelection[idx].value];
                } else if (box == "gender") {
                    this.genderSelected = [this.genderSelection[idx].value];
                } else if (box == "hour") {
                    this.hourSelected = [this.hourSelection[idx].value];
                }
            },

            handleConfirm: function() {
                this.$emit('confirmed');
                this.isLoading = true;
                PlayTesterUser.createPlayTesterProfile({
                    age: this.ageSelected,
                    behavior : this.behaviorSelected,
                    gender : this.genderSelected,
                    genre : this.genreSelected,
                    hours : this.hoursSelected,
                    platform: this.platformSelected,
                    profile : this.profileSelected,
                    purchasingBehavior: this.purchasingBehaviorSelected,
                    testerId: window.localStorage.getItem("userId"),
                },
                )
                .then(res => {
                    this.isLoading = false;
                })
                .catch(function (error) {
                    console.log(error);
                    this.isLoading = false;
                });

                this.$router.push({
                    name: 'dashboard',
                })
            },
        }
    }
</script>

<style>


#attribute-confirm {
    /* position: fixed; */
    width: 30%;
    height: 40px;
    top: 70px;
    margin-top: 20px;
    align-items: center;
    background: #FC7727;
    border: none;
    display: block;
    cursor: pointer;
    color: #ffffff;
}

#attribute-confirm:hover {
    background: #FF8C00;
}

.attribute-inlinetext {
    height: 30px;
    margin-bottom: 10px;
    font-weight: bold;
}

.attribute-biginput {
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

.white-text {
    color: #4b4b4d;
}

.filtering-testers {
    margin-top: 0%;
}

.attribute-assign-ctn {
    position: relative;
    margin-top: 10%;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.attribute-assign-item {
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

.attribute-assign-selection-box {
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
    padding: 2px 2px;

}

.attribute-assign-selection-box:hover {
    background-color: #e8e8e8;
}

.attribute-assign-selection-box:focus {
    outline: none;
    box-shadow: 0 0 5px rgb(255, 140, 0);
}

.bounce-enter-active, .bounce-leave-active {
  transition: transform .3s;
}
.bounce-enter, .bounce-leave-to {
  transform: scale(0.7);
}

</style>
