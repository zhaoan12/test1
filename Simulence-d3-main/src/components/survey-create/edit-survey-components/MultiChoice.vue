<template>
	<div class="question-container">
		<div class="question-head-container">
			<div class="question-title-container">
				<h4 class="question-number">Q{{ index+1 }}.</h4>
				<input class="question-text-box" type="text" placeholder="Untitled Question" v-model="content.title">
			</div>
			<p class="question-type-text">Multiple Choice</p>
		</div>
		<div v-for="i in content.options.length" class="w-100">
			<div class="option-container">
				<input class="form-check-input position-static" type="radio" disabled>
				<img v-if="imgSrcs[i-1] !== ''" class="optImgs" :src="imgSrcs[i-1]" />
				<input class="option-text-box" type="text" v-model="content.options[i-1].text">
				<label v-if="imgSrcs[i-1] === ''" class="btn">
					<input :id="'file-upload-' + index + '-' + i" type="file" class="d-none" accept="image/*" v-on:change="uploadImage(i)">
					<!-- file upload icon -->
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
						<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
						<path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
					</svg>
				</label>
				<!-- file close icon -->
				<b-button v-if="imgSrcs[i-1] !== ''" class="bg-transparent border-0 text-dark" v-on:click="() => removeImg(i)">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-folder-x" viewBox="0 0 16 16">
						<path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181L15.546 8H14.54l.265-2.91A1 1 0 0 0 13.81 4H2.19a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91H9v1H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zm6.339-1.577A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
						<path d="M11.854 10.146a.5.5 0 0 0-.707.708L12.293 12l-1.146 1.146a.5.5 0 0 0 .707.708L13 12.707l1.146 1.147a.5.5 0 0 0 .708-.708L13.707 12l1.147-1.146a.5.5 0 0 0-.707-.708L13 11.293l-1.146-1.147z"/>
					</svg>
				</b-button>
				<!-- x icon -->
				<b-button v-if="content.options.length != 1" class="bg-transparent border-0 text-dark" v-on:click="() => removeOption(i)">
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
import Vue from 'vue'
import Template from '../../../Firestore/Template.js'

export default {
	name: 'MultiChoiceEdit',
	props: {
		content: Object,
		index: Number
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
	methods: {
		clickAddOption() {
			this.content.options.push({"text": "Option", "imgSrc": ""})
			this.imgSrcs.push("")
		},
		removeOption(index) {
			console.log(this.content.options)
			console.log(this.imgSrcs)
			this.content.options.splice(index-1, 1)
			this.imgSrcs.splice(index-1, 1)
		},
		uploadImage(id) {
			const uploadButton = document.getElementById("file-upload-" + this.index + "-" + id)
			Template.uploadImage(uploadButton.files[0]).then(res => {
				this.content.options[id-1].imgSrc = res.url
    		})
			Vue.set(this.imgSrcs, id-1, URL.createObjectURL(uploadButton.files[0]))
		},
		removeImg(id) {
			Vue.set(this.imgSrcs, id-1, "")
			this.content.options[id-1].imgSrc = ""
		}
	}
}
</script>

<style scoped>
.optImgs {
	max-width: 15%;
	max-height: 12rem;
	margin: 0.5rem;
}
</style>
