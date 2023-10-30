<template>
	<div class="view-question-container">
		<b-form-group class="w-100">
			<div v-for="opt in content.options">
				<div class="view-option-container">
					<b-form-radio name="multi-choice" class="view-radio-button">
						<img v-if="opt.imgSrc !== ''" class="view-optImgs" :src="opt.imgSrc" />
						<div class="view-option-text">{{ opt.text }}</div>
					</b-form-radio>
				</div>
			</div>
		</b-form-group>
	</div>
</template>

<script>

export default {
	name: 'MultiChoiceView',
	props: {
		index: Number,
		content: Object
	},
	data() {
		return {
			imgSrcs: []
		}
	},
	mounted() {
		this.content.options.forEach(opt => {
			this.imgSrcs.push(opt.imgSrc)
		})
	},
}
</script>

<style scoped>
.view-question-container {
	padding: 0rem 0.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
    width: 90%;
}

.view-option-container {
	display: flex;
	width: 100%;
	margin: 0 0.5rem;
	align-items: center;
    padding: 0.25rem;
}

.view-option-text {
	margin: 0 1rem;
}

.view-radio-button {
	display: flex;
	align-items: center;
}

.view-optImgs {
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
