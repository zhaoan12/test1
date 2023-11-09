<template>
	<div class="card-timeline">
			<ul class="progress-tracker">
				<div v-for="i in progressSteps.length" class="progress-step" @click="$emit('nodeClick', i, progressSteps.length)">
					<li v-if="i <= step" class="active"> 
						<div>{{ i }}</div> 
						{{ progressSteps[i-1] }}
					</li> 
					<li v-else> 
						<div>{{ i }}</div> 
						{{ progressSteps[i-1] }}
					</li>
				</div>
			</ul>
		</div>
</template>

<script>
/* Progress bar code adapted from: https://bbbootstrap.com/snippets/bootstrap-4-bootstrap-4-timeline-order-tracking-step-step-progress-bar-26897417 */
export default {
	name: 'ProgressBar',
	props: {
		progressSteps: Array,
        step: Number
	}
}
</script>

<style scoped>
.progress-tracker {
	padding: 0;
	overflow: hidden;
	color: #878788 !important;
	display: flex;
	width: 100%;
	justify-content: center;
}

.progress-tracker div.progress-step{
	list-style-type: none;
	font-size: 13px;
	width: 25%;
	float: left;
	position: relative;
	font-weight: 400;
	color: #878788 !important;
	text-align: center;
	cursor: pointer;
}

.progress-tracker div.progress-step:first-child:before {
	margin-left: 15px !important;
	padding-left: 11px !important;
	text-align : left !important
}

.progress-tracker div.progress-step:last-child:before {
	margin-right: 5px !important;
	padding-right: 11px !important;
	text-align : right !important
}

.progress-tracker li>div {
	color: #fff;
	width: 29px;
	text-align: center;
	line-height: 29px;
	display: block;
	font-size: 12px;
	background: #878788;
	border-radius: 50%;
	margin: auto
}

.progress-tracker li:after {
	content: '';
	width: 150%;
	height: 2px;
	background: #878788 !important;
	position: absolute;
	left: 0%;
	right: 0%;
	top: 15px;
	z-index: -1;
}

.progress-tracker .progress-step:first-child li::after {
	left: 50% !important;
}

.progress-tracker .progress-step:last-child li::after {
	left: 0%!important;
	width: 0% !important;
}

.progress-tracker li.active {
	font-weight: bold;
	color: #FF7222 !important;
}

.progress-tracker li.active>div {
	background: #FF7222 !important;
}

.progress-tracker li.active:after {
	background: #FF7222 !important;
}

.card-timeline {
	background-color: white;
	border: none;
	z-index: 0;
	display: flex;
	box-shadow: 0 4px 10px -6px grey;
	width: 100%;
}
</style>
