<template>
	<div class="view-question-container">
        <div class="view-option-container">
			<img v-if="imgSrc != ''" class="view-textImg" :src="imgSrc" />
            <textarea class="form-control" rows="1" placeholder="Your answer"></textarea>
        </div>
	</div>

</template>

<script>

export default {
	name: 'TextAnswerView',
	props: {
		index: Number,
		content: Object
	},
	data() {
		return {
			imgSrc: ''
		}
	},
	mounted() {
		this.imgSrc = this.content.imgSrc
	}
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

.view-option-container {
	display: flex;
	width: 100%;
	align-items: center;
	flex-direction: column;
}

.view-textImg {
	max-height: 20rem;
	max-width: 50%;
	margin-bottom: 2rem;
}
</style>
