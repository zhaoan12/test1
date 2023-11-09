<template>
    <div class='d-flex'>
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>

        <navigator class="navigator" :flag="navFlag" />
        <div class='user-profile-page'>
            <div>
                {{ updateColor() }}
            </div>
            <imageCropper id="profile-image-cropper" v-if="cropperOn" :img="imgFile.src" :imgType="imgFile.type"
                stencilComponent="circle-stencil" :cropperProps="{ aspectRatio: 1 / 1 }"
                @cropConfirmed="handleCropperConfirm" @cropCanceled="handleCropperCancel" />

            <div id="profile-box">
                <div id="profile-ellipse" @mouseover="showShade" @mouseleave="hideShade"
                    v-bind:style="{ backgroundImage: 'url(' + userProfile.img + ')', backgroundSize: 'cover' }">
                    <input id="profile-upload-button" v-show="shadeOn" type="file" ref="file" @change="uploadImg($event)"
                        accept="image/*" />
                    <div id="profile-shade" v-if="shadeOn"></div>
                </div>
                <div id="translucent-box">
                    <div id="user-nickname">{{ userProfile.nickName }}</div>
                    <div id="user-bio">{{ userProfile.bio }}</div>
                </div>
            </div>

            <div id="setting-wrapper">
                <div style="background-color: orange;"></div>
                <sidebar id="userprofile-sidebar" :sideBarType="1" @clicked="onClickSidebar" />
                <div id="line">
                </div>
                <div class="profile-main-content">
                    <div v-if="idx == 0">
                        <router-view :userProfile="userProfile" :titleList="titleList" @changed="handleChange"
                            @modifying="handleModify" @confirmed="handleConfirm" />
                    </div>
                    <div v-if="idx == 1">
                        <router-view :userProfile="userProfile" :titleList="titleList" @changed="handleChange"
                            @modifying="handleModify" @confirmed="handleConfirm" />
                    </div>
                    <div v-if="idx == 2">
                        <router-view :userProfile="userProfile" :titleList="titleList" @changed="handleChange"
                            @modifying="handleModify" @confirmed="handleConfirm" />
                    </div>
                    <div v-if="idx == 3">
                        <router-view :userProfile="userProfile" :titleList="titleList" @changed="handleChange"
                            @modifying="handleModify" @confirmed="handleConfirm" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import navigator from '../layout/NavBarNew.vue'
import sidebar from '../layout/SideBar.vue'
import modifydisplay from './ModifyDisplay.vue'
import userProfileComponent from './UserProfile-Profile.vue'
import userContactComponent from './UserProfile-Contact.vue'
import userSecurityComponent from './UserProfile-Security.vue'
import userPreferenceComponent from './UserProfile-Preference.vue'
import imageCropper from '../layout/ImageCropper.vue'
import Loading from '../loading/index.vue'
import UserObject from "../../Firestore/UserObject";

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
    name: "userprofile",
    components: {
        navigator,
        sidebar,
        imageCropper,
        modifydisplay,
        userProfileComponent,
        userContactComponent,
        userSecurityComponent,
        userPreferenceComponent,
        Loading
    },
    data() {
        return {
            msg: "userprofile",
            navFlag: -1,
            userType: -1,  // 0: Tester, 1: Company, 2: Admin
            idx: 0,
            shadeOn: false,
            cropperOn: false,
            isLoading: false,
            imgFile: {
                src: null,
                type: null
            },
            userProfile: {
                userName: "",
                nickName: "",
                gender: "",
                bio: "",
                email: "",
                workPhone: "",
                mobile: "",
                password: "",
                img: "",
            },
            buffer: {
                userName: "",
                nickName: "",
                gender: "",
                bio: "",
                email: "",
                workPhone: "",
                mobile: "",
                password: "",
                img: "",
            },
            titleList: {
                userName: "Name",
                nickName: "Nick Name",
                bio: "Bio",
                gender: "Gender",
                email: "Email",
                workPhone: "Work Phone",
                mobile: "Mobile",
                password: "Password",
            },
        }
    },
    mounted() {
        if (window.localStorage.getItem("userType")) {
            this.userType = parseInt(window.localStorage.getItem("userType"));
            this.isLoading = true;
            UserObject.getProfile(window.localStorage.getItem("userId"))
                .then(res => {
                    let res_data = res.data;
                    let key_list = Object.keys(res_data);
                    for (let i = 0; i < 9; i++) {
                        this.userProfile[key_list[i]] = res_data[key_list[i]];
                    }
                    let key_list2 = Object.keys(this.userProfile)
                    for (let i = 0; i < 9; i++) {
                        this.buffer[key_list2[i]] = this.userProfile[key_list2[i]];
                    }
                    this.isLoading = false;
                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    this.isLoading = false;
                });
        } else {
            this.$router.push({
                name: 'login',
            })
        }
    },
    reset() {
        this.imgURL = null;
        this.imgFile = {
            src: null,
            type: null
        };
    },
    methods: {
        showShade: function () {
            this.shadeOn = true;
        },

        hideShade: function () {
            this.shadeOn = false;
        },

        uploadImg: function (event) {
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

        handleCropperConfirm: async function (imgBlob) {
            this.cropperOn = false;
            const reader = new FileReader();
            reader.readAsDataURL(imgBlob); // converts the blob to base64 and calls onload
            reader.onload = () => {
                this.userProfile.img = reader.result; // data url
                UserObject.updateProfile(
                    window.localStorage.getItem("userId"),
                    this.userProfile.userName,
                    this.userProfile.nickName,
                    this.userProfile.gender,
                    this.userProfile.bio,
                    this.userProfile.email,
                    this.userProfile.workPhone,
                    this.userProfile.mobile,
                    this.userProfile.password,
                    this.userProfile.img,
                )
                    .then(res => {
                        console.log("User avatar uploaded sucessfully!")
                        this.isLoading = false;
                    })
                    .catch(function (error) { // request failure handler
                        console.log(error);
                        this.isLoading = false;
                    });
            };
        },

        handleCropperCancel: function () {
            this.cropperOn = false;
        },

        onClickSidebar: function (index) {
            this.idx = index;
        },

        handleChange: function (title, newContent) {
            var trueKey = Object.keys(this.titleList).find(key => this.titleList[key] === title);
            this.buffer[trueKey] = newContent;
        },

        handleModify: function () {
            let key_list = Object.keys(this.userProfile)
            for (let i = 0; i < 9; i++) {
                this.buffer[key_list[i]] = this.userProfile[key_list[i]];
            }
        },

        handleConfirm: function () {
            let key_list = Object.keys(this.buffer)
            for (let i = 0; i < 9; i++) {
                this.userProfile[key_list[i]] = this.buffer[key_list[i]];
            }

            this.isLoading = true;

            UserObject.updateProfile(
                window.localStorage.getItem("userId"),
                this.userProfile.userName,
                this.userProfile.nickName,
                this.userProfile.gender,
                this.userProfile.bio,
                this.userProfile.email,
                this.userProfile.workPhone,
                this.userProfile.mobile,
                this.userProfile.password,
                this.userProfile.img
            )
                .then(res => {
                    this.isLoading = false;
                })
                .catch(function (error) { // request failure handler
                    console.log(error);
                    this.isLoading = false;
                });
        },
        updateColor: function () {
            var r = document.querySelector(':root');
            r.style.setProperty('--USERPROFILE', this.$store.state.userprofile);
            r.style.setProperty('--NICKNAME', this.$store.state.nickname);
        },
    },
    destroyed() {
        if (this.imgFile.src) {
            URL.revokeObjectURL(this.imgFile.src)
        }
    }
}
</script>

<style>
:root {
    --USERPROFILE: #fbfbfb;
    --NICKNAME: #fbfbfb;
}
.d-flex {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    width: 100%;
    height: 100%;
}
.user-profile-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    overflow: scroll;
    background: var(--USERPROFILE);
}

#profile-image-cropper {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 200;
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

#profile-box {
    position: relative;
    width: 80%;
    height: 220px;
    margin-left: 10%;
    margin-top: 100px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-sizing: border-box;
    border-radius: 10px;
    background: url("../../assets/profile_pic_example.jpg");
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: fixed;
}

#profile-ellipse {
    position: relative;
    border-radius: 50%;
    width: 130px;
    height: 130px;
    margin-left: 5%;
    margin-top: 60px;
    background-repeat: no-repeat;
    background-size: 100%;
    z-index: 2;
}

#profile-upload-button {
    position: absolute;
    top: 55px;
    left: 20%;
    width: 60%;
    z-index: 4;
}

#profile-shade {
    position: absolute;
    border-radius: 50%;
    top: 0px;
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    z-index: 3;
}

#translucent-box {
    position: relative;
    width: 100%;
    height: 80px;
    top: -50px;
    background: rgba(196, 196, 196, 0.2);
    border-radius: 0px 0px 10px 10px;
    z-index: 1;
}

#user-nickname {
    position: relative;
    left: 130px;
    margin-left: 10%;
    line-height: 45px;
    font-size: 24px;
    font-weight: bold;
    color: var(--NICKNAME);
}

#user-bio {
    position: relative;
    left: 130px;
    margin-left: 10%;
    line-height: 20px;
    font-size: 18px;
    color: var(--NICKNAME);
}

#setting-wrapper {
    position: relative;
    width: 100%;
    height: fit-content;
    margin-top: 10px;
    z-index: 1;
}

#userprofile-sidebar {
    position: relative;
    width: 20%;
    height: 100%;
    margin-left: 10%;
    margin-top: 40px;
    display: inline-block;
    vertical-align: top;
    z-index: 2;
}

.profile-main-content {
    position: relative;
    width: 50%;
    height: 100%;
    margin-left: 9%;
    margin-top: 40px;
    display: inline-block;
    vertical-align: top;
    overflow: auto;
}

#line {
    position: relative;
    height: 100%;
    width: 2px;
    left: -5px;
    top: 30px;
    background: #595B60;
    border-radius: 1px;
    display: inline-block;
    vertical-align: top;
    z-index: 1;
}
</style>