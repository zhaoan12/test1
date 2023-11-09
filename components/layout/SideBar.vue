<template>
    <div class="sidebar-ctn">
        <div class="side-tag-lst">
            <div v-for="(tag, index) in tags" :key="tag.name" class="side-tag-item" 
            :style="{'color': (index == idx ? $store.state.sidetextoc : $store.state.sidetext), 'border-right': (index == idx ? '2px solid #FFFFFF' : '')}"
            @click="changeTag(index)">
                <div class="side-tag-item-highlight-bar" :style="{'background-color': (index == idx ? $store.state.sidetextoc : $store.state.sidetext)}"></div>
                <div class="side-tag-item-content">
                    {{ tag.name }}
                </div>
            </div>
            <span v-if="isTester" class="side-tag-item" 
            @click="handleTesterProfile">
                TESTER PROFILE<br>
            </span>
            
        </div>
    </div>
</template>

<script>
    export default {
        name: "sidebar",
        props: {
            sideBarType: {
                type: Number,
                default: -1
            },
        },
        data() {
            return {
                isTester: false,
                msg: "sidebar",
                idx: (() => {
                    if (this.sideBarType == 0) {
                        return window.localStorage.getItem("gameDetailIndex") ? parseInt(window.localStorage.getItem("gameDetailIndex")) : 0;
                    } else if (this.sideBarType == 1) {
                        return window.localStorage.getItem("userProfileIndex") ? parseInt(window.localStorage.getItem("userProfileIndex")) : 0;
                    } else {
                        return 0;
                    }
                })(),
                tags: [],
                gameDetailTags: [
                    {
                        name: "DESCRIPTION",
                        link: "description",
                    }, {
                        name: "ANALYSIS",
                        link: "analysis",
                    }, {
                        name: "TESTERS",
                        link: "testers",
                    }, {
                        name: "RECORDINGS",
                        link: "recordings",
                    }
                ],
                userProfileTags: [
                    {
                        name: "PROFILE",
                        link: "profile",
                    }, {
                        name: "CONTACT",
                        link: "contact",
                    }, {
                        name: "SECURITY",
                        link: "security",
                    },
                    {
                        name: "PREFERENCE",
                        link: "preference",
                    }
                ],
            }
        },
        mounted() {
            if (this.sideBarType == 0) {
                this.tags = this.gameDetailTags;
            } else if (this.sideBarType == 1) {
                this.tags = this.userProfileTags;
            }

            // allowing the Tester Profile button to appear when userType is Tester
            if (window.localStorage.getItem("userType") === "0") {
                this.isTester = true
            } 
        },
        methods: {
            changeTag: async function(index) {
                await this.$router.push({
                    path: this.tags[index].link,
                })
                
                if (this.sideBarType == 0) {
                    window.localStorage.setItem("gameDetailIndex", index);
                } else if (this.sideBarType == 1) {
                    window.localStorage.setItem("userProfileIndex", index);
                }

                this.idx = index;
                this.$emit('clicked', index);
            },
            handleTesterProfile: function() {
                this.$router.push({
                    name: 'playtesteratt',
                })
            }
        }
    }
</script>

<style>
.sidebar-ctn {
    position: relative;
    height: 100%;
    display: inline-block;
    background-color: #FFF;
}

.side-tag-lst {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin: 0 1% 0 5%;
    background-color: #FFF;
    border-radius: 10px;
}

@media only screen and (max-width: 1330px) {
  .side-tag-lst {
    width: 235px;
  }
  .sidebar-ctn {
    margin-right: 2%;
  }
}

.side-tag-item {
    margin-top: 20%;
    font-style: normal;
    font-weight: normal;
    font-size: large;
    text-align: left;
    cursor: pointer;
    display: flex;
    width: 65%;
}

.side-tag-item-highlight-bar {
    height: 100%;
    width: 4px;
    margin-right: 8%;
}

.side-tag-item:hover {
    color: #424241 !important;
}
</style>
