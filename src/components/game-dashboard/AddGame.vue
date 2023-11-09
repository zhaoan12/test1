<template>
    <div class="d-flex">
        <navigator class="navigator" :flag="navFlag" />
        <div class='addgame-page'>
            <div class="title-header">
                <h1> Add Game </h1>
            </div>
            <gameInfoEdit id="addgame-content" :fromGame="false" :data="data" @confirmed="handleConfirm" />
        </div>
    </div>
</template>

<script>
import navigator from '../layout/NavBarNew.vue'
import gameInfoEdit from './GameInfoEdit.vue'
export default {
    name: "addgame",
    components: {
        navigator,
        gameInfoEdit
    },
    data() {
        return {
            msg: "addgame",
            navFlag: -1,
            userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
            modify: true,
            data: {
                gameId: "-1",
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
                }
            }
        }
    },
    mounted() {
        if (window.localStorage.getItem("userType")) {
            this.userType = parseInt(window.localStorage.getItem("userType"));
        } else {
            this.$router.push({
                name: 'login',
            })
        }
    },
    methods: {
        handleConfirm: function () {
            this.modify = false;
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.modify) {
            const answer = window.confirm('Do you really want to leave? All unsaved changes will be lost!')
            if (answer) {
                next();
            } else {
                next(false);
            }
        } else {
            next();
        }
    }
}
</script>

<style>
.addgame-page {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    margin: 0px 0px 0px auto;
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
::-webkit-scrollbar {
    width: 5px;
    height: 100%;
    border-radius: 10px;
    background: #b3b5bb;
}

::-webkit-scrollbar-thumb {
    width: 5px;
    background: #272727;
    border-radius: 10px;
}

#addgame-content {
    position: relative;
    width: 80%;
    height: auto;
    margin-left: 10%;
    margin-top: 85px;
}

.white-text {
    color: #2f2f30;
}
</style>