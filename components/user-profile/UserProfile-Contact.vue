<template>
    <div class="user-profile-component">
        <modifydisplay title="Email" :modify2="modify" :content="userProfile.email" @changed="handleChange" />
        <modifydisplay title="Work Phone" :modify2="modify" :content="userProfile.workPhone" @changed="handleChange" />
        <modifydisplay title="Mobile" :modify2="modify" :content="userProfile.mobile" @changed="handleChange" />
        <input v-if="!modify" id="userprofile-modify" type="submit" value="MODIFY" @click.prevent="handleModify"/>
        <input v-if="modify" id="userprofile-confirm" type="submit" value="CONFIRM" @click.prevent="handleConfirm"/>
    </div>
</template>

<script>
    import modifydisplay from './ModifyDisplay.vue'
    export default {
        name: "userContactComponent",
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
#userprofile-modify {
    position: absolute;
    width: 25%;
    height: 35px;
    right: 3%;
    top: 5px;
    background: #FC7727;
    color: #292828;
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
    background: #E39E4D;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
}
</style>
