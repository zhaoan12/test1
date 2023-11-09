<template>
	<div class="question-container">
		<h4 v-if="content.title == ''" class="question-title">Q{{ index+1 }}. Untitled Question</h4>
		<h4 v-else class="question-title">Q{{ index+1 }}. {{ content.title }}</h4>
		<div class="option-container">
			<!-- 
				note: you can't change the height of the dropdown. see the following link for browser defaults: 
				https://stackoverflow.com/questions/570642/height-of-an-html-select-box-dropdown
			-->
			<b-form-select v-model="selected" class="dropdown-toggle" v-on:change="() => $emit('choose-dropdown', index, selected)">
				<b-form-select-option v-if="selected == null" :value="null">Select</b-form-select-option>
				<b-form-select-option v-for="(opt, i) in content.options" :value="i" :key="opt">{{ opt }}</b-form-select-option>
			</b-form-select>
		</div>
	</div>
</template>

<script>

export default {
	name: 'DropdownPreview',
	props: {
		index: Number,
		content: Object
	},
	data() {
		return {
			selected: null
		}
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

.option-container {
	display: flex;
	width: 100%;
}

.dropdown-toggle {
	background: transparent !important;
	color: gray !important;
	border: 1px solid lightgray !important;
	display: flex !important;
    justify-content: space-between;
    align-items: center;
	min-width: 10rem;
	padding: 0.5rem;
}
</style>