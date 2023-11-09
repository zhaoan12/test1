<template>
    <div class="add-tester-item" :style="{'border-bottom': (hasBorder ? '2px solid #595B60' : '')}">
        <div>
            <transition name="fade">
                <Loading v-if="isLoading"></Loading>
            </transition>
        </div>
        <img class="add-tester-item-pic" :src="pic">
        <div class="add-tester-item-name">{{ name }}</div>
        <div class="add-tester-item-email">{{ email }}</div>
        <div v-if="hasButton" class="add-tester-item-btn" @click="addTester">Add Tester</div>
    </div>
</template>

<script>
    import Loading from '../loading/index.vue'
    import Firestore from '../../Firestore.js'
    import PlayTesterUser from "../../Firestore/PlayTesterUser";
    export default {
        name: "addTesterItem",
        components: {
            Loading
        },
        props: {
            id: {
                type: String
            },
            pic: {
                type: String,
                default: require("../../assets/avatar_default.png")
            },
            name: {
                type: String,
                default: "TESTER NAME"
            },
            email: {
                type: String,
                default: "tester@gmail.com"
            },
            hasBorder: {
                type: Boolean,
                default: true
            },
            gameId: {
                type: String
            },
            hasButton: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                userType: -1,
                isLoading: false,
            }
        },
        mounted() {
            this.userType = parseInt(window.localStorage.getItem("userType"));
        },
        methods: {
            addTester: function() {
                let that = this;
                that.isLoading = true;
                PlayTesterUser.createTester(this.gameId, this.id)
                .then(res => {
                    console.log("add tester");
                    that.$emit('addTester');
                    that.isLoading=false;
                })
                .catch(e => {
                    alert(e.error);
                    that.isLoading=false;
                });
            }
        }
    }
</script>

<style>
.add-tester-item {
    position: relative;
    height: 90px;
    width: 100%;
}
.add-tester-item-pic {
    position: absolute;
    top: 20px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
}
.add-tester-item-name {
    position: absolute;
    top: 24px;
    left: 79px;
    height: 21px;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 21px;
    color: #C4C2C2;
}
.add-tester-item-email {
    position: absolute;
    bottom: 24px;
    left: 79px;
    height: 21px;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 21px;
    color: #858484;
}
.add-tester-item-btn {
    position: absolute;
    width: 97px;
    height: 28px;
    right: 0;
    bottom: 31px;
    background: #666464;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 5px;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 28px;
    color: #C4C2C2;
    text-align: center;
}
</style>
