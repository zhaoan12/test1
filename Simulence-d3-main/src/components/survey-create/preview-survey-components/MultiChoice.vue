<template>
	<div class="question-container">
		<h4 v-if="content.title == ''" class="question-title">Q{{ index+1 }}. Untitled Question</h4>
		<h4 v-else class="question-title">Q{{ index+1 }}. {{ content.title }}</h4>
		<b-form-group class="w-100">
			<div v-for="(opt, i) in content.options">
				<div class="option-container" @mouseup="() => $emit('choose-multi-choice', index, i)">
					<b-form-radio name="multi-choice" class="radio-button">
						<img v-if="opt.imgSrc !== ''" class="optImgs" :src="opt.imgSrc" />
						<p class="option-text">{{ opt.text }}</p>
					</b-form-radio>
				</div>
			</div>
		</b-form-group>
	</div>
</template>

<script>

export default {
	name: 'MultiChoicePreview',
	props: {
		index: Number,
		content: Object
	},
}
</script>

<style scoped>
.question-container {
  margin: 1rem;
	padding: 1.5rem 3rem;
	background-color: white;
	border-radius: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
  width: 100%;
}

.question-title {
  color: #FF7222;
  width: 100%;
}

div.option-container {
	display: flex;
	width: 100%;
	margin: 0.25rem !important;
	align-items: center;
  padding: 0.25rem;
}

.option-text {
  margin: 0 0 0 1rem;
  font-size: 1rem;
}

p {
	color: black !important;
	font-size: 14px;
}

.radio-button {
	display: flex;
	align-items: center;
}

.optImgs {
	max-width: 45%;
	max-height: 12rem;
	margin: 0.5rem;
}
</style>

<style>
.custom-control-label {
	display: flex;
	align-items: center;
}
</style>
