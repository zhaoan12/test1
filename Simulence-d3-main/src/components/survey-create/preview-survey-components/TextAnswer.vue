<template>
	<div class="question-container">
		<h4 v-if="content.title == ''" class="question-title">Q{{ index+1 }}. Untitled Question</h4>
		<h4 v-else class="question-title">Q{{ index+1 }}. {{ content.title }}</h4>
        <div class="option-container flex-column">
			<img v-if="imgSrc != ''" class="textImg" :src="imgSrc" />
            <textarea v-model="answer" class="form-control" rows="1" placeholder="Your answer" v-on:change="() => $emit('choose-text-answer', index, answer)"></textarea>
        </div>
	</div>

</template>

<script>

export default {
	name: 'TextAnswerPreview',
	props: {
		index: Number,
		content: Object
	},
	data() {
		return {
			imgSrc: '',
			answer: ''
		}
	},
	mounted() {
		this.imgSrc = this.content.imgSrc
	}
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
	margin: 0.5rem;
	align-items: center;
    padding: 0.25rem;
}

.textImg {
	max-height: 20rem;
	max-width: 50%;
	margin-bottom: 2rem;
}
</style>
