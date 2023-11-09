<template>
  <div class='user-card'>
    <div>
      {{updateColor()}}
    </div>
    <b-card
      tag="article"
      style="max-width: 20rem;"
      class="mb-2 card-color"
    >
      <b-card-text>
        <strong>Username</strong>: {{this.userName}}<br />
        <strong>Email</strong>: {{this.email}} <br />
        <strong>User Type</strong>: {{this.userTypeText}}<br />
        <strong>Number of Games Assigned</strong>: {{this.gameIds.length}} <br />
      </b-card-text>

      <b-button class="delete-button" href="#" variant="danger" v-on:click="() => {removeUser(userID)}">Delete</b-button>
    </b-card>
</div>

</template>

<script>
export default {
  name: "UserItem",
  props: {
    userName: '',
    email: '',
    userID: "",
    userTypeText: "",
    gameIds: []
  },
  data() {
    return {
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
    }
  },
  mounted() {
    this.userType = parseInt(window.localStorage.getItem("userType"));
  },
  methods: {
    removeUser(userID) {
      this.$emit("removeUser",userID)
    },

    updateColor: function() {
        var r = document.querySelector(':root');
        r.style.setProperty('--CARD_COLOR_BACKGROUND', this.$store.state.cardColor_background);
               
    },
  },
}
</script>

<style scoped>
:root {
    --CARD_COLOR_BACKGROUND: #fbfbfb;
   
}

.user-card{
  position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-clip: border-box;
    border-radius: 0.25rem;
    min-width: 150px;
    margin-left: 5px;
}


.card-color {
  /* background: var(--CARD_COLOR_BACKGROUND); */
  background-color: white;
}
.delete-button {
  background: #ff8e4d !important;
}

</style>