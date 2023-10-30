<template>
  <div class="game-detail-description">
      <div>
            {{updateColor()}}
      </div>
      <div v-if="!modify">
          <gameTitle
          :id="detail.gameName"
          :title="detail.gameName"
          :img="detail.img"
          :company="detail.company"
          :endTime="detail.endTime"/>
          <input id="gamedetail-modify" type="submit" value="MODIFY" @click.prevent="handleModify"/>
          <div class="gamedetail-title white-text">DESCRIPTION</div>
          <div class="gamedetail-content white-text">
              {{ this.detail.description }}
          </div>
          <div class="gamedetail-title white-text">CONTACT INFO</div>
          <div class="gamedetail-content white-text"><b>QA Lead: </b>{{ detail.qaLead.name }}</div>
          <div class="gamedetail-content white-text"><b>Work Phone: </b> {{ detail.qaLead.workPhone }}</div>
          <div class="gamedetail-content white-text"><b>Mobile: </b>{{ detail.qaLead.mobile }}</div>
          <div class="gamedetail-content white-text"><b>Email: </b>{{ detail.qaLead.email }}</div>
      </div>

      <div v-if="modify" id="addgame-content">
          <gameInfoEdit 
          :fromGame="true"
          :data="detail" 
          @confirmed="handleConfirm"/>
      </div>
  </div>
</template>

<script>
  import gameInfoEdit from '../game-dashboard/GameInfoEdit.vue'
  import gameTitle from './GameTitle.vue'
  export default {
      name: "gameDetailDescription",
      components: {
          gameInfoEdit,
          gameTitle
      },
      props: {
          detail: {
              type: Object
          }
      },
      data() {
          return {
              msg: "gameDetailDescription",
              userType: window.localStorage.getItem("userType") ? parseInt(window.localStorage.getItem("userType")) : -1,  // 0: Tester, 1: Company, 2: Admin
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
          handleModify: function() {
              this.modify = true;
          },

          handleConfirm: function() {
              this.modify = false;
          },
          
          updateColor: function() {
              var r = document.querySelector(':root');
              r.style.setProperty('--GAMEDM', this.$store.state.gamedm);
          },
      },
      beforeRouteLeave (to, from, next) {
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
:root {
  --GAMEDM: #fbfbfb;
}
.game-detail-description {
  position: relative;
  margin-right: 5%;
}

#gamedetail-pic {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 5px;
  display: inline-block;
  vertical-align: top;
}

#basic-info {
  position: relative;
  margin-left: 5%;
  display: inline-block;
  vertical-align: top;
}

#gamedetail-name {
  position: relative;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

#gamedetail-company {
  position: relative;
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 20px;
}

#gamedetail-endtime {
  position: relative;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 16px;
}

#gamedetail-modify {
  position: absolute;
  width: 25%;
  height: 40px;
  right: 0;
  top: 50px;
  background: #FC7727;
  color: var(--GAMEDM);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
}

.gamedetail-title {
  margin-top: 40px;
  margin-bottom: 20px;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 13px;
  display: flex;
  align-items: center;
}

.gamedetail-content {
  margin-bottom: 5px;
  font-style: normal;
}

.white-text {
  color: #000000;
}
</style>
