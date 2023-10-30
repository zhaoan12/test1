<template>
	<div class="question-container">
		<div class="question-head-container">
			<div class="question-title-container">
				<h4 class="question-number">Q{{ index+1 }}.</h4>
				<input class="question-text-box" type="text" placeholder="Untitled Question" v-model="content.title">
			</div>
			<p class="question-type-text">Multiple Select</p>
		</div>
		<div v-for="i in content.options.length" class="w-100">
			<div class="option-container">
				<input class="form-check-input position-static" type="checkbox" disabled>
				<input class="option-text-box" type="text" v-model="content.options[i-1]">
				<!-- X icon -->
				<b-button v-if="content.options.length != 1" class="bg-transparent border-0 text-dark" v-on:click="() => removeOption(i-1)">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
						<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
					</svg>
				</b-button>
			</div>
		</div>
		<div class="add-option-div">
			<b-button class="add-option" v-on:click="() => clickAddOption()">Add Option</b-button>
		</div>
		<div class="d-flex w-100 justify-content-end">
			<!-- trash can icon -->
			<b-button class="bg-transparent border-0 text-muted" v-on:click="() => $emit('remove-question', index)">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
					<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
					<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
				</svg>
			</b-button>
		</div>
	</div>
</template>

<script>

export default {
	name: 'MultiSelectEdit',
	props: {
		content: Object,
		index: Number
	},
	methods: {
		clickAddOption() {
			this.content.options.push("Option")
		},
		removeOption(index) {
			this.content.options.splice(index, 1)
		}
	}
}
</script>

<style>
</style>
