<template>
  <div class="modify-display">
      <div class="modify-display-title">{{ title }}</div>
      <div class="modify-display-content" v-if='!modify2'>{{ title == 'Password' ? '******' : content }}</div>
      <input class='modify-input' v-if='modify2' type="text" :placeholder="title" :value="content" @input="newContent = $event.target.value"/>
  </div>
</template>

<script>
  export default {
      name: "modifydisplay",
      props: {
          title: {
              type: String,
          },
          content: {
              type: String,
          },
          modify2: {
              type: Boolean,
          },
      },
      data() {
          return {
              msg: "modifydisplay",
              newContent: "",
          }
      },
      mounted() {
      },
      methods: {
      },
      watch: {
          newContent: function() {
              this.$emit('changed', this.title, this.newContent);
          }
      }
  }
</script>

<style>
.modify-display {
  height: 100px;
}

.modify-display-title {
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: -0.015em;
  color: #E75B4B;
}

.modify-display-content {
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  letter-spacing: -0.015em;
  color: #242424;
}

.modify-input {
  position: relative;
  width: 65%;
  height: 40px;
  margin-right: 3%;
  background-color: #eee !important;
  border-radius: 10px !important;
  /* background: #8a8888; */
  border: 1px solid #eee;
  box-sizing: border-box;
  border-radius: 5px;
}
.modify-input:focus {
  outline: none;
  border-color:#00BFFF;
  box-sizing: border-box;
  border-radius: 5px;
}

.modify-input:not(:focus) {
  border-color: #eee;
}
</style>