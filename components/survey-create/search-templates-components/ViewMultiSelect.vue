<template>
	<div class="view-question-container">
		<b-form-group class="w-100">
			<div v-for="opt in content.options">
				<div class="view-option-container">
					<b-form-checkbox name="multi-select" class="view-checkbox">
						<div class="view-option-text">{{ opt }}</div>
					</b-form-checkbox>
				</div>
			</div>
		</b-form-group>
	</div>
</template>

<script>

export default {
	name: 'MultiSelectView',
	props: {
		index: Number,
		content: Object
	}
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

.view-checkbox {
	display: flex;
	align-items: center;
}
</style>
