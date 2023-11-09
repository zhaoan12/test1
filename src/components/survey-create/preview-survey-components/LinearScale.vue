<template>
	<div class="question-container">
		<h4 v-if="content.title == ''" class="question-title">Q{{ index+1 }}. Untitled Question</h4>
		<h4 v-else class="question-title">Q{{ index+1 }}. {{ content.title }}</h4>
		<div class="option-container linear-scale-container">
			<p>{{ content.startLabel }}</p>
			<div v-for="i in scale">
				<div class="scale-buttons-container">
					<p class="m-0">{{ i + parseInt(content.start) - 1 }}</p>
					<input class="form-check-input radio-button" type="radio" name="linear-scale" v-on:click="() => $emit('choose-linear-scale', index, i + parseInt(content.start) - 1)">
				</div>
			</div>
			<p>{{ content.endLabel }}</p>
		</div>
	</div>
</template>

<script>

export default {
	name: 'LinearScalePreview',
    props: {
		index: Number,
		content: Object
	},
	data() {
		return {
			scale: 0
		}
	},
	mounted() {
		this.scale = this.content.end - this.content.start + 1
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

p {
	color: black !important;
}

.radio-button {
	transform:scale(1.25)
}

.scale-buttons-container {
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	padding: 1rem;
}

.linear-scale-container {
	justify-content: space-evenly;
	align-items: flex-end;
	display: flex;
}
</style>
