<template>
    <div class="d-flex">
        <navigator class="navigator" :flag="navFlag" />
        <div id='playtesteratt-page'>

            <attributeEdit id="attribute-content" @confirmed="handleConfirm" />
        </div>
    </div>
</template>

<script>
import navigator from '../layout/NavBarNew.vue'
import attributeEdit from './AttributeEdit.vue'
export default {
    name: "playtesteratt",
    components: {
        navigator,
        attributeEdit
    },
    data() {
        return {
            msg: "playtesteratt",
            navFlag: -1,
            userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
            modify: true,
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
#playtesteratt-page {
    /* position: fixed; */
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
    background: #b3b5bb;
}

::-webkit-scrollbar-thumb {
    width: 5px;
    background: #272727;
    border-radius: 10px;
}

#attribute-content {
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