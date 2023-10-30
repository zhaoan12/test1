<template>
	<div class="view-question-container">
		<div class="view-linear-scale-container">
			<p>{{ content.startLabel }}</p>
			<div v-for="i in scale">
				<div class="view-scale-buttons-container">
					<div>{{ i + parseInt(content.start) - 1 }}</div>
					<input class="form-check-input" type="radio" name="linear-scale">
				</div>
			</div>
			<p>{{ content.endLabel }}</p>
		</div>
	</div>
</template>

<script>

export default {
	name: 'LinearScaleView',
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
.view-question-container {
	margin: 0.25rem 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
    width: 90%;
}

.view-scale-buttons-container {
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	padding: 1rem;
}

.view-linear-scale-container {
	display: flex;
	width: 90%;
	justify-content: space-evenly;
	align-items: flex-end;
}
</style>
