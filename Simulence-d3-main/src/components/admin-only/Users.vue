<template>
  <div class='d-flex'>

    <navigator :flag="navFlag" />
    <div class="users-page">
      <div>
        <transition name="fade">
          <Loading v-if="isLoading"></Loading>
        </transition>
      </div>
      <div class="title-header">
        <h1>Users</h1>
      </div>

      <div id="user-cards">
        <UserItem v-for="temp in this.allUsers" :key="temp.id" :userID="temp.id" :userName="temp.userName"
          :email="temp.email" :userTypeText="temp.userType" :gameIds="temp.gameIds" v-on:removeUser="removeUser" />
      </div>
    </div>
  </div>
</template>


<script>
import navigator from '../layout/NavBarNew.vue'
import UserItem from "./UserItem";
import UserCollection from "../../Firestore/UserCollection";
import UserObject from "../../Firestore/UserObject";
import Loading from '../loading/index.vue';

export default {
  name: "Users",
  components: {
    UserItem,
    navigator,
    Loading
  },
  data() {
    return {
      msg: "users",
      navFlag: 2,
      userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin,
      allUsers: []
    }
  },
  mounted() {
    if (window.localStorage.getItem("userType")) {
      this.userType = parseInt(window.localStorage.getItem("userType"));
      this.getUsers()
    } else {
      this.$router.push({
        name: 'login',
      })
    }
  },
  methods: {
    getUsers() {
      UserCollection.getAllUsers()
        .then(res => {
          this.allUsers = res.data
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    removeUser(userID) {
      let res = UserObject.deleteUser(userID);

      res.then(response => {
        if (response.exist) {
          this.getUsers();
        } else {
          alert(res.statusText)
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>


<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background-color: #EEEEEE;
}

.title-header {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
  box-shadow: 0 4px 10px -6px grey;
}

.title-header h1 {
  color: #FF7222;
  font-weight: bold;
}

#user-cards {
  padding-top: 80px;
  display: flex;
  justify-content: center;
  color: white;
  flex-wrap: wrap;
}</style>
