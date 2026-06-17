<script setup lang="ts">
import { ref } from "vue"

const isOpen = ref(false)

const toggle = () => {
	isOpen.value = true
}

const close = (e: MouseEvent) => {
	e.stopPropagation()
	isOpen.value = false
}
</script>

<template>
	<div
		class="bg-ember relative cursor-pointer overflow-hidden"
		:class="isOpen ? 'absolute inset-0 top-0 right-0 left-0 h-full w-full' : 'bg-ember h-[60px] w-[60px] rounded-full'"
		:style="{
			width: isOpen ? '270px' : '60px',
			height: isOpen ? '270px' : '60px',
			borderRadius: isOpen ? '0px' : '9999px'
		}"
		@click="toggle"
	>
		<div class="text-abyssal absolute top-[40px] right-[40px]" @click="close">×</div>
	</div>
</template>
<style scoped>
.cta {
	position: absolute;
	color: #f5ce67;
	text-transform: uppercase;
	font-size: 22px;
	letter-spacing: 1px;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.social {
	width: 70%;
	margin: 75px auto 0;
	padding: 0;
	list-style: none;
}

.social li {
	display: flex;
	justify-content: space-between;
	padding-bottom: 15px;
}

.fake-input {
	width: 60%;
	margin: 10px auto 0;
	background: #f3f6fb;
	color: #b2b5bc;
	border-radius: 10px;
	padding: 15px;
	font-size: 15px;
}
</style>
