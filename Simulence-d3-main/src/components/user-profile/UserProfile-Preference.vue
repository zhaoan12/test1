<template>
    <div class="user-profile-component">
        <label for="color-selection" :style="{'color': $store.state.pretext}">background color selection</label>
        <select v-model="selected" id="color-selection" @change="chooseColor" @input="setSelected">
            <option value="Default">Default</option>
            <option value="Dark">Dark</option>
          </select>
    </div>
</template>

<script>
    import modifydisplay from './ModifyDisplay.vue'
    export default {
        name: "userPreferenceComponent",
       
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
                selected: localStorage.getItem('selectedTheme')
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

            this.chooseColor();
           
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

            chooseColor: function() {
                var e = document.getElementById("color-selection");
                var selectedItem = e.options[e.selectedIndex].value;
                localStorage.setItem('selectedTheme', selectedItem);
                if (selectedItem == 'Dark'){
                    this.$store.commit('darkcolor');
                }
                else if(selectedItem == 'Default'){
                    this.$store.commit('defaultcolor');
                }
            },
            setSelected: function() {
                if (localStorage.getItem('selectedTheme') === null) { 
                    localStorage.setItem('selectedTheme', "Default");
                    document.getElementById("color-selection").selectedItem = "Default"; 
                }
                else {
                    if (localStorage.getItem('selectedTheme') === "default") { 
                        document.getElementById("color-selection").selectedItem = "Default"; 
                    } else if (localStorage.getItem('selectedTheme') === "Dark") { 
                        document.getElementById("color-selection").selectedItem = "Dark"; 
                    }
                }
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
    background: #e15a06;
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
