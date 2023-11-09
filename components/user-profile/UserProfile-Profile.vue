<template>
    <div class="user-profile-component">
        <div>
        {{updateColor()}}
        </div>
        <modifydisplay title="Name" :modify2="modify" :content="userProfile.userName" @changed="handleChange" />
        <modifydisplay title="Nick Name" :modify2="modify" :content="userProfile.nickName" @changed="handleChange" />
        <modifydisplay title="Gender" :modify2="modify" :content="userProfile.gender" @changed="handleChange" />
        <modifydisplay title="Bio" :modify2="modify" :content="userProfile.bio" @changed="handleChange" />
        <input v-if="!modify" id="userprofile-modify" type="submit" value="MODIFY" @click.prevent="handleModify"/>
        <input v-if="modify" id="userprofile-confirm" type="submit" value="CONFIRM" @click.prevent="handleConfirm"/>
    </div>
</template>

<script>
    import modifydisplay from './ModifyDisplay.vue'
    export default {
        name: "userProfileComponent",
        components: {
            modifydisplay,
        },
        props: {
            userProfile: {
                type: Object,
            },
            titleList: {
                type: Object,
            }
        },
        data() {
            return {
                userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
                userAvator: require('../../assets/avator_example.jpg'),
                idx: 0,
                modify: false,
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

            onClickSidebar: function(index) {
                this.idx = index;
            },

            handleChange: function(title, newContent) {
                this.$emit('changed', title, newContent);
            },

            handleModify: function() {
                this.modify = true;
                this.$emit('modifying');
            },
            
            handleConfirm: function() {
                this.modify = false;
                this.$emit('confirmed');
            },

            updateColor: function() {
                var r = document.querySelector(':root');
                r.style.setProperty('--MODIFYBK', this.$store.state.modifybk);
                r.style.setProperty('--MODIFY', this.$store.state.modify);
                r.style.setProperty('--CONFIRM', this.$store.state.confirm);
            },
        },
        beforeRouteLeave (to, from, next) {
            if (this.modify) {
                const answer = window.confirm('Do you really want to leave? All unsaved changes will be lost!')
                if (answer) {
                    next()
                } else {
                    next(false)
                }
            } else {
                next()
            }
        }
    }
</script>

<style>
:root {
    --MODIFYBK: #fbfbfb;
    --MODIFY: #fbfbfb;
    --CONFIRM: #fbfbfb;
}
#userprofile-modify {
    position: absolute;
    width: 25%;
    height: 35px;
    right: 3%;
    top: 5px;
    background: var(--MODIFYBK);
    color: var(--MODIFY);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
}

#userprofile-confirm {
    position: absolute;
    width: 25%;
    height: 35px;
    right: 3%;
    top: 5px;
    background: var(--CONFIRM);
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
}
</style>
