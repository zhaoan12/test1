<template>
  <div id="big-button-container" class="d-flex flex-column align-items-center justify-content-center h-100">
    <b-button class="big-button" v-on:click="$emit('create-new')">Create New</b-button>
    <h4>or</h4>
    <b-button class="big-button" v-on:click="$emit('use-template')">Use a Template</b-button>
  </div>
</template>

<script>
export default {
	name: 'SelectSurveyStart'
}
</script>

<style scoped>
#big-button-container {
  padding: 1rem 0px 10rem 0px;
}

.btn.big-button {
	background: #FF7222 !important;
	margin: 5px;
  height: 150px;
  width: 380px;
	border: none;
  font-size: x-large;
  font-weight: bold;
}

.btn.big-button:hover, .btn.big-button:focus, .btn.big-button:active {
	background: #ff8e4d !important;
}

@media screen and (max-width: 600px) {
  .btn.big-button {
    aspect-ratio: 8/3;
    width: 60vw;
    height: auto;
  }
}
</style>
