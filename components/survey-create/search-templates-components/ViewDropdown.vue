<template>
	<div class="view-question-container">
		<div>
			<b-dropdown text="Select" varient="none">
				<div v-for="opt in content.options">
					<b-dropdown-item class="p-1">{{ opt }}</b-dropdown-item>
				</div>
			</b-dropdown>
		</div>
	</div>
</template>

<script>

export default {
	name: 'DropdownView',
	props: {
		index: Number,
		content: Object
	}
}
</script>

<style scoped>
.view-question-container {
	margin: 0.25rem 1rem;
	display: flex;
}
</style>

<style>
/* overwriting bootstrap classes */
.dropdown-menu {
	max-height: 120px !important;
	overflow-y: scroll !important;
	font-size: medium;
}

.dropdown-toggle {
	background: transparent !important;
	color: gray !important;
	border: 1px solid lightgray !important;
	display: flex !important;
    justify-content: space-between;
    align-items: center;
	min-width: 10rem;
	font-size: medium;
}
</style>