<template>
  <div class="game-title-item">
      <img class="game-title-item-img" :src="img">
      <div class="game-title-item-name">{{ title }}</div>
      <div class="game-title-item-studio">{{ company }}</div>
      <div class="game-title-item-endtime">End Time: {{ endTimeText }}</div>
  </div>
</template>

<script>
  export default {
      name: "gameTitle",
      props: {
          id: {
              type: String
          },
          img: {
              type: String,
          },
          title: {
              type: String
          },
          company: {
              type: String
          },
          endTime: {
              type: String
          }
      },
      data() {
          return {
              userType: -1,
              endTimeText: ""
          }
      },
      mounted() {
          this.userType = parseInt(window.localStorage.getItem("userType"));
          let end = new Date(this.endTime);
          this.endTimeText = end.toDateString();
      },
  }
</script>

<style>
.game-title-item {
  position: relative;
  height: 120px;
}

.game-title-item-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 120px;
  height: 120px;
  border-radius: 5px;
}

.game-title-item-name {
  position: absolute;
  height: 46px;
  left: 150px;
  top: 0;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 46px;
  color: #FC7727;
}

.game-title-item-studio {
  position: absolute;
  height: 21px;
  left: 150px;
  top: 46px;
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 21px;
  color: #494848;
}

.game-title-item-endtime {
  position: absolute;
  right: 0;
  top: 12.5px;
  height: 21px;
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 21px;
  color: #5e5d5d;
}
</style>
