<template>
	<div class="question-container">
		<div class="question-head-container">
			<div class="question-title-container">
				<h4 class="question-number">Q{{ index+1 }}.</h4>
				<input class="question-text-box" type="text" placeholder="Untitled Question" v-model="content.title">
			</div>
			<p class="question-type-text">Linear Scale</p>
		</div>
        <div class="option-container">
            <b-form-select v-model="content.start" :options="startOptions" class="dropdown"></b-form-select>
            <input class="option-text-box" type="text" placeholder="Start label" v-model="content.startLabel">
        </div>
        <div class="option-container">
            <p class="to-text">to</p>
        </div>
        <div class="option-container">
            <b-form-select v-model="content.end" :options="endOptions" class="dropdown"></b-form-select>
            <input class="option-text-box" type="text" placeholder="End label" v-model="content.endLabel">
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
	name: 'LinearScaleEdit',
	components: {},
    props: {
		content: Object,
        index: Number
	},
	data() {
		return {
            startOptions: [ {value: '0', text: '0'}, {value: '1', text: '1'} ],
            endOptions: [
                {value: '2', text: '2'},
                {value: '3', text: '3'},
                {value: '4', text: '4'},
                {value: '5', text: '5'},
                {value: '6', text: '6'},
                {value: '7', text: '7'},
                {value: '8', text: '8'},
                {value: '9', text: '9'},
                {value: '10', text: '10'}
            ]
		}
	}
}
</script>

<style scoped>

.dropdown {
    padding: 0.3rem;
    border-radius: 10px;
    border-color: lightgray;
    color: gray;
}

.to-text {
    color: black;
    margin: 0;
}

</style>
